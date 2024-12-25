import DepartmentModel from "../Models/Department.js";
import fs from "fs";
export const CreateDepartment = async (req, res) => {
  try {
    const depData = await DepartmentModel.create({
      name: req.body.name,
      image: req?.file?.filename,
      university: req.body.universityId,
    });
    if (depData)
      res.status(201).send({
        message: "Department Created",
      });
    else res.status(404).send({ message: "Unable to create department" });
  } catch (error) {
    console.log("Fail to submit data!!!");
  }
};
export const UpdateDepartment = async (req, res) => {
  try {
    const existingDep = await DepartmentModel.findById(req.body.id);
    if (!existingDep) {
      return res.status(404).send({ message: "Departmenet no found!!" });
    }
    //delelte the image the folder
    if (req.file) {
      if (existingDep.image) {
        const oldImagePath = `uploadDep/${existingDep.image}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    //Update Department Data
    const UpdateData = {
      name: req.body.name,
      image: req.file ? req.file.filename : existingDep.image,
    };
    const depData = await DepartmentModel.findByIdAndUpdate(
      req.body.id,
      UpdateData,
      { new: true }
    );
    if (depData) {
      res.status(200).send({ message: "Department update successfully!!!" });
    } else {
      res.status(404).send({ message: "Unable to update Department" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ message: "internal server error" });
  }
};
export const DeleteDepartment = async (req, res) => {
  try {
    //find Department by id
    const existingDep = await DepartmentModel.findById(req.body.id);
    if (!existingDep) {
      return res.status(404).send({ message: "Department Not Found!!!" });
    }
    //Department Delete
    const depData = await DepartmentModel.deleteOne({ _id: req.body.id });
    //Image Delete
    if (depData.deletedCount > 0) {
      //check if Dep had an image
      if (existingDep.image) {
        const imagePath = `uploadDep/${existingDep.image}`;
        try {
          //if image exist
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("Department Image Deleted");
          }
        } catch (error) {
          console.log("Unable to Delete Image", error);
        }
      }
      res.status(200).send({
        message: "Department and its Image successfull Deleted!!",
        DeleteDepartment: existingDep,
      });
    } else {
      res.status(404).send({ message: "Unable to Delete Department" });
    }
  } catch (error) {
    console.log("Error:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};
export const GetDepartmentByUniversityId = async (req, res) => {
  try {
    const depData = await DepartmentModel.find({
      university: req.query.universityId,
    }).populate("university");
    res.status(200).send({ depData });
  } catch (error) {
    console.log("Fail to submit data!!!");
  }
};
