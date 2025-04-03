export async function encryptFile(file: File, password: string) {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
  
    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileBytes
    );
  
    const fullData = new Uint8Array(iv.byteLength + encrypted.byteLength);
    fullData.set(iv, 0);
    fullData.set(new Uint8Array(encrypted), iv.byteLength);
  
    return new Blob([fullData]);
  }
  
  export async function decryptFile(encryptedFile: Blob, password: string) {
    const data = new Uint8Array(await encryptedFile.arrayBuffer());
    const iv = data.slice(0, 12);
    const encryptedData = data.slice(12);
  
    const key = await deriveKey(password);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );
  
    return new Blob([decrypted]);
  }
  
  async function deriveKey(password: string) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("your-unique-salt"),
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  