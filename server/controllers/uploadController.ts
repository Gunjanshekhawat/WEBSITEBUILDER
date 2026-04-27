// import { v2 as cloudinary } from "cloudinary";

// export const uploadImage = async (req:any, res:any) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });

//     }
//     console.log("FILE:", req.file);

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     res.json({
//       url: result.secure_url,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };


import cloudinary from "../configs/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cloudinary को buffer से upload करो
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // 💡 यही URL आगे JSON/DB में save करो
    res.json({
      url: result.secure_url,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

