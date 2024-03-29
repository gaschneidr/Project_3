document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;  

  // By default, load the inboxx
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  //try show_page
  document.querySelector('#detail-view').style.display="none";

  //inbox,sent,archived
  if(mailbox=="inbox"){
    
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        emails.forEach(showEmails);
        
        function showEmails(email){

          const senderContainer=document.createElement('strong');
          senderContainer.innerHTML=email.sender;

          const emailDiv=document.createElement('div');
          emailDiv.className+="email-div";
          emailDiv.id='email'+email.id;

          if(email.read==true){
            emailDiv.style.background="grey";
            emailDiv.title="You have read this email.";
          }
          else{
            emailDiv.style.background="white";
            emailDiv.title="You have not read this email";
          }

          //
          emailDiv.addEventListener('click',function(){

            var id=emailDiv.id;
            //email42
            id=id.substring(5);

            fetch('/emails/'+id)
          .then(response => response.json())
          .then(email => {
              // Print email
              console.log(email);
              document.querySelector("#detail-view").innerHTML="";

              const body_paragraph = document.createElement("p");
              body_paragraph.innerHTML= email.body


              // const archive_button= document.createElement("button");
              // archive_button.innerHTML="Archive";
              // archive_button.onclick="archive_email();";
              // archive_button.className+="btn";
              // archive_button.className+= " btn-sm";
              // archive_button.className+= " btn-outline-primary";
              // archive_button.id="email-id"+email.id;

              
              const reply_button= document.createElement("button");
              reply_button.innerHTML="Reply";
              reply_button.onclick="reply_email();";
              reply_button.className+="btn";
              reply_button.className+= " btn-sm";
              reply_button.className+= " btn-outline-primary";
              reply_button.id="email-id"+email.id;
              reply_button.addEventListener("click", function(){

                document.querySelector("#emails-view").style.display="none";
                document.querySelector("#detail-view").style.display="none";
                document.querySelector("#compose-view").style.display="block";
                document.querySelector("#compose-recipients").value=email.sender;
                document.querySelector("#compose-subject").value= " RE: "+email.subject;
                document.querySelector("#compose-body").value= "On "+ email.timestamp + email.sender +" wrote: " + email.body;
              
            
              
              });
          

              const from = document.createElement("p");
              from.innerHTML= email.sender;
              from.style.display= "inline";

              const from_label = document.createElement("strong");
              from_label.innerHTML = "From: "

              const to= document.createElement("p");
              to.innerHTML=email.recipients[0];
              to.style.display= "inline";

              const to_label = document.createElement("strong");
              to_label.innerHTML= "To: "

              const timestamp =document.createElement("p");
              timestamp.innerHTML= email.timestamp;
              timestamp.style.display= "inline";

              const timestamp_label = document.createElement("strong");
              timestamp_label.innerHTML= "Sent: ";

              const subject =document.createElement("p");
              subject.innerHTML= email.subject;
              subject.style.display="inline";

              const subject_label = document.createElement("strong");
              subject_label.innerHTML= "Subject: ";

              const new_line_1=document.createElement("br");
              const new_line_2=document.createElement("br");
              const new_line_3=document.createElement("br");
              const new_line_4=document.createElement("br");
              const new_line_5=document.createElement("hr");

              document.querySelector("#detail-view").appendChild(from_label);
              document.querySelector("#detail-view").appendChild(from);
              document.querySelector("#detail-view").appendChild(new_line_1);

              document.querySelector("#detail-view").appendChild(to_label);
              document.querySelector("#detail-view").appendChild(to);
              document.querySelector("#detail-view").appendChild(new_line_2);

              document.querySelector("#detail-view").appendChild(timestamp_label);
              document.querySelector("#detail-view").appendChild(timestamp);
              document.querySelector("#detail-view").appendChild(new_line_3);

              document.querySelector("#detail-view").appendChild(subject_label);
              document.querySelector("#detail-view").appendChild(subject);
              document.querySelector("#detail-view").appendChild(new_line_4);
              document.querySelector("#detail-view").appendChild(reply_button);
              // document.querySelector("#detail-view").appendChild(archive_button);
              document.querySelector("#detail-view").appendChild(new_line_5);

              document.querySelector("#detail-view").appendChild(body_paragraph);

              document.querySelector("#emails-view").style.display="none";
              document.querySelector("#detail-view").style.display="block";

              fetch('/emails/'+id, {
                method: 'PUT',
                body: JSON.stringify({
                    read: true
            })


            // ... do something else with email ...
        });

        
        })

          });

          emailDiv.innerHTML=senderContainer.outerHTML+"&nbsp;&nbsp;&nbsp;&nbsp;"+email.subject+ "&nbsp;&nbsp;&nbsp;&nbsp;" +email.timestamp;

          document.querySelector('#emails-view').append(emailDiv);
        }

        // ... do something else with emails ...
    });
  }
  else if(mailbox=="sent"){

    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
        // Print emails
        console.log(emails);

        emails.forEach(showEmails);
        
        function showEmails(email){

          const senderContainer=document.createElement('strong');
          senderContainer.innerHTML=email.sender;

          const emailDiv=document.createElement('div');
          emailDiv.className+="email-div";
          emailDiv.id='email'+email.id;

          emailDiv.innerHTML=senderContainer.outerHTML+"&nbsp;&nbsp;&nbsp;&nbsp;"+email.subject+ "&nbsp;&nbsp;&nbsp;&nbsp;" +email.timestamp;

          document.querySelector('#emails-view').append(emailDiv);
        }
  

        // ... do something else with emails ...
    });

  }



  // Show the mailbox and hide other views

  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


//

}

//Send Email function
function send_email(event){
  event.preventDefault()
  const recipient=document.querySelector('#compose-recipients').value;
  const subject=document.querySelector('#compose-subject').value;
  const body=document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox("sent")
  });

  load_mailbox("inbox");

}


function reply_email(){

}