import { response } from "express";
import UniversityModel from "../Models/University.js";
import fs from "fs";
export const CreateUniversity = async (req, res) => {
  try {
    const univData = await UniversityModel.create({
      name: req.body.name,
      image: req?.file?.filename,
    });
    if (univData) res.status(201).send({ message: "University Created" });
    else res.status(404).send({ message: "Unable to create university" });
  } catch (error) {
    console.log("Fail to submit data!!!");
  }
};
export const UpdateUniversity = async (req, res) => {
  try {
    const existingUni = await UniversityModel.findById(req.body.id);
    if (!existingUni) {
      return res.status(404).send({ message: "University not found" });
    }
    if (req.file) {
      if (existingUni.image) {
        const oldImagePath = `uploadUniv/${existingUni.image}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    //UPdate University Data
    const UpdateData = {
      name: req.body.name,
      image: req.file ? req.file.filename : existingUni.image,
    };
    const univData = await UniversityModel.findByIdAndUpdate(
      req.body.id,
      UpdateData,
      { new: true }
    );
    if (univData) {
      res.status(200).send({ message: "University Updated Successfully" });
    } else {
      res.status(404).send({ message: "Unable to Update University" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const DeleteUniversity = async (req, res) => {
  try {
    //Find University By Id
    const existingUni = await UniversityModel.findById(req.body.id);
    if (!existingUni) {
      return res.status(404).send({ message: "University not found" });
    }
    //Now delete the University
    const univData = await UniversityModel.deleteOne({
      _id: req.body.id,
    });
    //Image Delete
    if (univData.deletedCount > 0) {
      if (existingUni.image) {
        const imagePath = `uploadUniv/${existingUni.image}`;
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("University Image Also Deleted!!");
          }
        } catch (error) {
          console.log("Unable to Delete Image", error);
        }
      }
      res.status(200).send({
        message: "University and It's Image Successfully Deleted!!!",
        DeleteUniversity: existingUni,
      });
    } else {
      res.status(404).send({ message: "Unable to Delete University!!!" });
    }
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
export const GetUniversity = async (req, res) => {
  try {
    const univData = await UniversityModel.find();
    res.status(200).send({ univData });
  } catch (error) {
    console.log("Fail to submit data!!!");
  }
};
