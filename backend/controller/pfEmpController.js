const ErrorHandler = require("../utils/ErrorHandler");
const catchAysncError = require("../middleware/catchAsyncError");
const pfEmpInfo = require("../model/pfEmpModel");
const payrollUserModel = require("../model/payrollUserModel")

//To upload employee pf info by Hr Admin
exports.createPfEmpInfo = catchAysncError(async (req, res, next) => {

  const data = req.body
  let confirmedUser = new Map();
  const notUpdated = [];

  if(!data)
  {
    return next( new ErrorHandler("Data was not provided",400))
  }

  const payrollIds = await payrollUserModel.find({empStatus:"Confirmed"},{_id:0,empId:1})
  for(let i=0;i<payrollIds.length;i++)
  {
    confirmedUser.set(payrollIds[i].empId,1)
  }

  for(let i=0;i<data.length;i++)
  {
    if(confirmedUser.has(data[i].empId))
    {
      await pfEmpInfo.updateOne({empId:data[i].empId},{...data[i],createdby:req.body.createdby},{upsert:true})
    }
    else
    {
      notUpdated.push(data[i].empId)
    }
  }

  if(notUpdated.length>0)
  {
    // console.log(5)
    return res.status(200).json({success:true,error:`${notUpdated} not added yet in ERP system`})
  }
  // console.log(4)
  res.status(200).json({success:true,message:"added all pfEmp data"})


  // try {
  //   const candiInfo = await pfEmpInfo.insertMany(req.body);
  //   // console.log(req.body);
  //   res.send(candiInfo);
  //   res.status(200).json(candiInfo);
  // } catch (error) {
  //   if (error.code === 11000) {
  //     const err = { ...error };
  //     let errMessageArray = err.writeErrors[0].err.errmsg.split("key: ");
  //     let strErrMessage = errMessageArray[1];
  //     let empErrorKey = strErrMessage.split(': "')[0].split("{ ")[1];
  //     let empErrorValue = strErrMessage.split(': "')[1].split(`" }`)[0];
  //     let mainErrorMessage = `Pf Information of Employee with ${empErrorKey} = ${empErrorValue} already exists`;
  //     return res.status(200).json({ success: false, error: mainErrorMessage });
  //   }
  // }
});

// To get employee information for Owner
exports.getAllPfEmp = catchAysncError(async (req, res, next) => {
  const empInfo = await pfEmpInfo.find();
  res.status(200).json({ success: true, empInfo });
});

// edit functinality of an active pf employee
exports.singlePfEmployee = async (req, res) => {
  const singlePfEmp = await pfEmpInfo.findOne({ empId: req.params.id });
  res.status(200).json(singlePfEmp);
};

exports.editPfEmployee = async (req, res) => {
  await pfEmpInfo.findByIdAndUpdate(req.params.id, req.body);
  res.send(req.body);
};
