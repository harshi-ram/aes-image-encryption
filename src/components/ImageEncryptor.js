import React, { useState } from "react";
import CryptoJS from "crypto-js";

const ImageEncryptor = () => {
  const [image, setImage] = useState(null);
  const [secretKey, setSecretKey] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptedImage, setDecryptedImage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const encryptImage = () => {
    if (!image || !secretKey) {
      alert("Upload image and enter secret key");
      return;
    }

    const encrypted = CryptoJS.AES.encrypt(image, secretKey).toString();
    setEncryptedText(encrypted);
  };

  const downloadEncryptedFile = () => {
    const blob = new Blob([encryptedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "encrypted.txt";
    link.click();
  };

  const handleDecryptFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const bytes = CryptoJS.AES.decrypt(reader.result, decryptKey);
        const original = bytes.toString(CryptoJS.enc.Utf8);

        if (!original) {
          alert("Wrong secret key!");
          return;
        }

        setDecryptedImage(original);
      } catch (err) {
        alert("Decryption failed");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Image Encryption using AES Algorithm</h2>

      <h3>Encrypt Image</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} /><br /><br />
      <input
        type="text"
        placeholder="Enter Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      /><br /><br />
      <button onClick={encryptImage}>Encrypt</button>

      {encryptedText && (
        <>
          <p>Encrypted Successfully</p>
          <button onClick={downloadEncryptedFile}>Download encrypted.txt</button>
        </>
      )}

      <hr />

      <h3>Decrypt Encrypted File</h3>
      <input
        type="text"
        placeholder="Enter Secret Key to Decrypt"
        value={decryptKey}
        onChange={(e) => setDecryptKey(e.target.value)}
      /><br /><br />
      <input type="file" accept=".txt" onChange={handleDecryptFile} />

      {decryptedImage && (
        <>
          <h4>Decrypted Image</h4>
          <img src={decryptedImage} alt="Decrypted" width="300" />
        </>
      )}
    </div>
  );
};

export default ImageEncryptor;
