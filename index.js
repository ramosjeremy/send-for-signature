const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function sendForSignature() {

//OnTask Configuration Setup
    let ontaskGroupAPIToken = "d3b4b6a7-6542-4b4d-bd40-3571fb4385f2";
    let apiBaseURL = "https://app.ontask.io/api/v2";
    let ontaskWorkflowID = "21d7c844-1634-4026-8eca-af124ab27396";
    let testEmailAddress = "jramos@accusoft.com";

 //OnTask Document Upload API Call
    let templateFile = fs.readFileSync(path.join(__dirname, 'APIDemoContract.docx'));

    const documentsResponse = await axios.post(`${apiBaseURL}/documents`,
            templateFile,
            {headers: {'Authorization': ontaskGroupAPIToken, 'Content-Type': 'application/pdf'}})
            .catch(function (error) {
                console.log(error);
            });

 //OnTask fields API Call
    let documentID = await documentsResponse.data.documentId;
    let fieldsConfiguration = { fields: [
            { anchorString: "%SignatureA%", name: "Signature A",height:20,width:180,xOffset:2,yOffset:5,removeAnchorString: true,required: true,type: "signature" },
            { anchorString: "%NameA%", name: "Name",height:12,width:180,xOffset:2,yOffset:5,removeAnchorString: true,required: true,type: "text" },
            { anchorString: "%DateA%", name: "Date",height:12,width:180,xOffset:2,yOffset:5,removeAnchorString: true,required: true,type: "text" }
        ]
    }

    const fieldsResponse = await axios.put(`${apiBaseURL}/documents/${documentID}/fields`,
        fieldsConfiguration,
            {headers: {'Authorization': ontaskGroupAPIToken}})
            .catch(function (error) {
                console.log(error);
            });

//OnTask Start Workflow API Call
    let workflowPostBody = { FileName: documentID, ToEmail: testEmailAddress}
    const workflowStarResponse = await axios.post(`${apiBaseURL}/workflowTemplates/${ontaskWorkflowID}`,
        workflowPostBody,
        {headers: {'Authorization': ontaskGroupAPIToken}})
        .catch(function (error) {
            // handle error
            console.log(error);
        });

    console.log(workflowStarResponse.data);
}

sendForSignature();
