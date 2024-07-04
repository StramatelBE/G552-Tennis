const Media = require("../Models/mediaModel");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const sharedEmitter = require("../Utils/SharedEmitter");
require("dotenv").config();

class MediaController {
  constructor() {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const username = req.params.user;
        const userFolder = `${process.env.UPLOAD_PATH}${username}`;
        cb(null, userFolder);
        console.log("userFolder", userFolder);
      },
      filename: (req, file, cb) => {
        const hash = crypto.createHash("sha256");
        hash.update(file.originalname + Date.now().toString());
        const fileName = hash.digest("hex");
        cb(null, fileName + "." + file.mimetype.split("/")[1]);
        file.filename = fileName;
      },
    });
    this.upload = multer({ storage: this.storage, limits: { fileSize: 1000 * 1024 * 1024 } });
    this.media = new Media();
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.delete = this.delete.bind(this);
  }

  create = (req, res) => {
    const username = req.params.user;
    this.upload.single("file")(req, res, (err) => {
      if (err) {
        console.log(err, "test");
        res.status(500).json({ message: err });
      } else {
        const file = req.file;
        const filePath = `${process.env.UPLOAD_PATH}${username}/${file.filename}`;
        const thumbnailPath = `${process.env.UPLOAD_PATH}${username}/thumbnails/${file.filename}.png`;

        if (file.mimetype.startsWith('video/')) {
          ffmpeg(filePath)
            .screenshots({
              timestamps: ['50%'],
              filename: `${file.filename}.png`,
              folder: `${process.env.UPLOAD_PATH}${username}/thumbnails`,
              size: '380x240'
            })
            .on('end', () => {
              console.log('Thumbnail generated');
              const relativeThumbnailPath = `/medias/${username}/thumbnails/${file.filename}.png`;
              this.saveMediaToDB(file, req.params.id, username, relativeThumbnailPath, res);
            })
            .on('error', (err) => {
              console.error('Error generating thumbnail', err);
              res.status(500).json({ message: 'Error generating thumbnail' });
            });
        } else {
          this.saveMediaToDB(file, req.params.id, username, null, res);
        }
      }
    });
  };

  saveMediaToDB = (file, userId, username, thumbnailPath, res) => {
    this.media
      .create(file, userId, username, thumbnailPath)
      .then((media) => {
        sharedEmitter.emit("created", file.filename);
        res.status(201).json({ message: "File uploaded successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err });
      });
  };

  update = (req, res) => {
    this.media
      .update(req.body)
      .then((media) => {
        sharedEmitter.emit("updated", req.file.filename);
        res.status(200).json(media);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getAll = (req, res) => {
    this.media
      .getAll()
      .then((medias) => {
        res.status(200).json(medias);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getById = (req, res) => {
    this.media
      .getById(req.params.id)
      .then((media) => {
        if (media) {
          res.status(200).json(media);
        } else {
          res.status(404).json({ message: "Media not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  getByUserId = (req, res) => {
    this.media
      .getByUserId(req.params.user)
      .then((media) => {
        if (media) {
          res.status(200).json(media);
        } else {
          res.status(404).json({ message: "Media not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };

  delete = (req, res) => {
    this.media
      .getById(req.params.id)
      .then((file) => {
        const filePath = file.path;
        const thumbnailPath = file.thumbnailPath;

        fs.unlink(process.env.MEDIA_DISPLAY_PATH + filePath, (err) => {
          if (err) {
            console.error("Error deleting media file", err);
          } else {
            console.log("Media file deleted");
          }


          if (thumbnailPath) {
            fs.unlink(process.env.MEDIA_DISPLAY_PATH + thumbnailPath, (err) => {
              if (err) {
                console.error("Error deleting thumbnail file", err);
              } else {
                console.log("Thumbnail file deleted");
              }
            });
          }

          // Supprimer l'entrée de la base de données
          this.media
            .delete(req.params.id)
            .then(() => {
              console.log("delete OK");
              return res.status(204).json({ message: "File deleted successfully" });
            })
            .catch((err) => {
              console.log(err);
              return res.status(500).json({ message: err });
            });
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  };
}

module.exports = MediaController;
