import React, { useEffect } from "react"
import Layout from "../../components/Layout"
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from "react"
import { getOwnerData } from "../../services/apiFunction"
import SideBar from "../../components/OwnersSidebar"
import Modal from "react-modal"
import { Link } from "gatsby"

function App() {
  const [candirecords, setCandirecords] = useState<any>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)

  //To get all Candidate data
  const getAllCandidates = async () => {
    let rejectCandi:any = []
    let data = await getOwnerData()

    if (data.success === true) {
      setCandirecords(data.candiInfo)
    }

    data.candiInfo.map((d:any) => {
      if (d.candiStatus === "Rejected") {
        rejectCandi.push(d)
      }
    })

    setCandirecords(rejectCandi)
  }

  const onButtonClick = (rejectedMessage:any) => {
    setModalIsOpen(true)
    setTimeout(() => {
     var commonModal = document.getElementById(
        "common-modal"
      ) as HTMLElement
      commonModal.innerHTML = `<p>${rejectedMessage}</p>`
      var heading = document.getElementById("heading") as HTMLElement
      heading.innerText =
        "Candidate's rejection details"
    }, 200)
  }

  useEffect(() => {
    getAllCandidates()
  }, [])

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
                  List of Rejected Candidates
                </h2>
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
                        <th className="heading">Reson of Rejection</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candirecords &&
                        candirecords.map((candirecord:any, Index:number) => {
                          if (candirecord.candiStatus == "Rejected") {
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
                                  {" "}
                                  <button
                                    id="modalbtn"
                                    onClick={() =>
                                      onButtonClick(candirecord.rejectedMessage)
                                    }
                                  >
                                    See details{" "}
                                  </button>
                                </td>
                              </tr>
                            )
                          }
                        })}
                    </tbody>
                  </table>
                </div>
                <Modal isOpen={modalIsOpen}>
                  <h1
                    className="RejectMheading text-center pt-4"
                    id="heading"
                  ></h1>
                  <div className="rejectInfoModal" id="common-modal"></div>
                  <div className="modalBtnDiv">
                    <button
                      className="modalbtn"
                      onClick={() => setModalIsOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default App
