import React, { useEffect } from "react"
import Layout from "../../components/Layout"
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
import { getOwnerData } from "../../services/apiFunction"
import { editCandiStatus } from "../../services/apiFunction"
import SideBar from "../../components/OwnersSidebar"
import { Link } from "gatsby"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const rejectedReasonInitialValue = {
  rejectedMessage: "",
  id: "",
  candidateName: "",
}
function App() {
  const [candirecords, setCandirecords] = useState<any>([])
  const [rejectBoxShow, setRejectBoxShow] = useState<any>(false)
  const [rejectReason, setRejectReason] = useState(rejectedReasonInitialValue)

  // To get All candidates with Pending Status
  const getAllCandidates = async () => {
    let pendingCandi:any = []
    let data = await getOwnerData()
    data.candiInfo.map((d:any) => {
      if (d.candiStatus === "Pending") {
        pendingCandi.push(d)
      }
    })
    setCandirecords(pendingCandi)
  }

  useEffect(() => {
    getAllCandidates()
  }, [])

  //To Reject the candidate
  const saveRejectCandi = async () => {
    if (rejectReason.rejectedMessage) {
      
      toast.success(
        "Candidate " + rejectReason.candidateName + " is rejected successfully")
      // )
      await editCandiStatus(rejectReason.id, {
        candiStatus: "Rejected",
        rejectedMessage: rejectReason.rejectedMessage,
      })
      setRejectBoxShow(false)
      setRejectReason(rejectedReasonInitialValue)
      await getAllCandidates()
    } else {
      //alert("Please select any reason to reject the candidate.")
      toast.success("Please select any reason to reject the candidate.")
    }
  }

  //To Select/Aprrove the candidate
  const saveApproveCandi = async (id:any, candidateName:any) => {
  
    await editCandiStatus(id, { candiStatus: "Selected" })
    // getAllCandidates()
    // window.alert("Candidate" + candidateName + " is selected successfully")
    toast.success("Candidate " + id + " is selected successfully")
    await getAllCandidates()
  }

  //To Hold the candidate
  const saveHoldCandi = async (id:any, candidateName:any) => {
    editCandiStatus(id, { candiStatus: "Hold" })
    getAllCandidates()
    //window.alert("Candidate" + candidateName + " is on hold")
    toast.success("Candidate " + id + " is on hold"
    
    
    
    )
    getAllCandidates()
  }

  return (
    <Layout>
      <div className="OwnerContainer">
        <div className="row ownerRow">
          <div className="col-lg-3">
            <SideBar />
          </div>
          <div className="col-lg-9">
            <div className="row ownerColumn justify-content-end">
              <div className="margin col-xl-11 col-lg-10 col-md-10 col-sm-6 wrapper">
                <h2 className="bulkText text-center">
                  List of Final Candidates
                </h2>
                <h3 className="text-center">
                  Note: Following is the list of finalised candidates with
                  Pending status
                </h3>
                <div className="empTable">
                  <table className="table-bordered ownersTable">
                    <thead>
                      <tr>
                        <th className="heading">Sr. No.</th>
                        <th className="heading">Candidate ID</th>
                        <th className="heading">Candidate Name</th>
                        <th className="heading">Educational qualification</th>
                        <th className="heading">Primary Skills</th>
                        <th className="heading">Secondary Skills</th>
                        <th className="heading">Notice Period</th>
                        <th className="heading">Current CTC</th>
                        <th className="heading">Expected CTC</th>
                        <th className="heading">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candirecords &&
                        candirecords.map((candirecord:any, Index:any) => {
                          if (candirecord.candiStatus == "Pending") {
                            return (
                              <tr key={Index}>
                                <td>{Index + 1}</td>
                                <td>{candirecord.candidateId}</td>
                                <td>{candirecord.candidateName}</td>
                                <td>{candirecord.eduQual}</td>
                                <td>{candirecord.primarySkill}</td>
                                <td>{candirecord.secondarySkill}</td>
                                <td>{candirecord.noticePeriod}</td>
                                <td>{candirecord.currentCTC}</td>
                                <td>{candirecord.expectedCTC}</td>
                                <td>
                                  <div className="col-4 offset-8 d-flex justify-content-end">
                                    <button
                                      className="btn btn-success"
                                      data-testid="selectBtn"
                                      onClick={e =>
                                        saveApproveCandi(
                                          candirecord.candidateId,
                                          candirecord.candidateName
                                        )
                                      }
                                    >
                                      Select
                                    </button>
                                    <button
                                      className="btn btn-info"
                                      data-testid="holdBtn"
                                      onClick={e =>
                                        saveHoldCandi(
                                          candirecord.candidateId,
                                          candirecord.candidateName
                                        )
                                      }
                                    >
                                      Hold
                                    </button>
                                    <button
                                      className="btn btn-danger"
                                      data-testid="rejectBtn"
                                      onClick={() => {
                                        setRejectBoxShow(true)
                                        setRejectReason({
                                          ...rejectReason,
                                          id: candirecord.candidateId,
                                          candidateName:
                                            candirecord.candidateName,
                                        })
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        })}
                    </tbody>
                  </table>
                </div>
                {rejectBoxShow ? (
                  <div data-testid="reject-msg-modal" className="modal RejectReasonModal ">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Select reason to reject the candidate{" "}
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                              setRejectBoxShow(false)
                              setRejectReason(rejectedReasonInitialValue)
                            }}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                            <div className="myRejectClass">
                              <label
                                htmlFor="message-text"
                                className="col-form-label"
                              >
                                Reasons:
                              </label>
                              <br></br>
                              <label>
                                <input
                                  type="radio"
                                  name="rejectedMessage"
                                  value="Lack of Technical knowledge"
                                  onChange={e =>
                                    setRejectReason({
                                      ...rejectReason,
                                      rejectedMessage: e.target.value,
                                    })
                                  }
                                />
                                Lack of Technical knowledge
                              </label>
                              <br></br>
                              <label>
                                <input
                                  type="radio"
                                  name="rejectedMessage"
                                  value="Lack of Communication Skills"
                                  onChange={e =>
                                    setRejectReason({
                                      ...rejectReason,
                                      rejectedMessage: e.target.value,
                                    })
                                  }
                                />
                                Lack of Communication Skills
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="rejectedMessage"
                                  value="Lack of grasping power"
                                  onChange={e =>
                                    setRejectReason({
                                      ...rejectReason,
                                      rejectedMessage: e.target.value,
                                    })
                                  }
                                />
                                Lack of grasping power
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="rejectedMessage"
                                  value="Not accepted offer letter"
                                  onChange={e =>
                                    setRejectReason({
                                      ...rejectReason,
                                      rejectedMessage: e.target.value,
                                    })
                                  }
                                />
                                Not accepted offer letter
                              </label>
                              <br></br>
                              <label>
                                <input
                                  type="radio"
                                  name="rejectedMessage"
                                  value="Delay in joining"
                                  onChange={e =>
                                    setRejectReason({
                                      ...rejectReason,
                                      rejectedMessage: e.target.value,
                                    })
                                  }
                                />
                                Delay in joining
                              </label>
                              <br></br>
                              <label>Details</label>
                            </div>
                            <textarea
                              className="form-control"
                              id="message-text"
                              data-testid="rejectReason"
                              name="rejectedMessage"
                              onChange={e =>
                                setRejectReason({
                                  ...rejectReason,
                                  rejectedMessage: e.target.value,
                                })
                              }
                              value={rejectReason.rejectedMessage}
                            ></textarea>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            data-testid = "closeRejectModal"
                            onClick={() => {
                              setRejectBoxShow(false)
                              setRejectReason(rejectedReasonInitialValue)
                            }}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-testid="finalRejectButton"
                            onClick={e => saveRejectCandi()}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
