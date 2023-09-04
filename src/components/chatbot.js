import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";

const Chatbot = ({ steps, name }) => {
  if (!localStorage.getItem("clinic" + name))
    localStorage.setItem("clinic" + name, JSON.stringify([]));

  const [showChatbot, setShowChatbot] = useState(false);
  const [profiles, setProfiles] = useState(
    localStorage.getItem("clinic" + name)
      ? JSON.parse(localStorage.getItem("clinic" + name))
      : []
  );
  const handleClick = () => {
    setShowChatbot(!showChatbot);
  };
  let tmp = {
    name: "",
    email: "",
    phone: "",
    day: ""
  };
  const handleEnd = value => {
    const values = value.renderedSteps;
    values.forEach(element => {
      switch (element.id) {
        case "enter-name":
          tmp.name = element.value;
          break;
        case "enter-phone-number":
          tmp.phone = element.value;
          break;
        case "enter-email":
          tmp.email = element.value;
          break;
        case "choose-day":
          tmp.day = element.value;
          let tt = JSON.parse(localStorage.getItem("clinic" + name));
          tt.push(tmp);
          localStorage.setItem("clinic" + name, JSON.stringify(tt));
          setProfiles(tt);
          break;
        case "question-enter-name":
          tmp.name = element.value;
          break;
        case "question-enter-email":
          tmp.email = element.value;
          tt = JSON.parse(localStorage.getItem("clinic" + name));
          tt.push(tmp);
          localStorage.setItem("clinic" + name, JSON.stringify(tt));
          setProfiles(tt);
          break;
        case "question-enter-phone-number":
          tmp.phone = element.value;
          break;
        default:
          break;
      }
    });
  };
  return (
    <React.Fragment>
      <h1 style={{ textAlign: "center" }}>Clinic{name}</h1>
      <p
        style={{ color: "red", textDecoration: "underline" }}
        onClick={handleClick}
      >
        Our chatbot assistant will guide you. You can send data easily.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Patient Name</th>
            <th>Patient E-mail</th>
            <th>Patient Phone Number</th>
            <th>Appointment day</th>
          </tr>
        </thead>
        <tbody>
          {profiles?.map((patient, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>{patient.day}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "end"
        }}
      >
        {showChatbot && (
          <ChatBot
            botDelay={4000}
            handleEnd={handleEnd}
            botAvatar="/react-chatbot/unnamed.jpg"
            bubbleOptionStyle={{
              fontSize: "17px"
            }}
            bubbleStyle={{
              fontSize: "17px",
              fontFamily: "Arial"
            }}
            contentStyle={{
              width: "40vw",
              height: "65vh",
              fontFamily: "Arial"
            }}
            avatarStyle={{
              width: "40px",
              height: "40px"
            }}
            headerComponent={
              <h1
                style={{
                  textAlign: "center",
                  background: "#6E48AA",
                  color: "white",
                  margin: 0,
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                Clinic{name}
              </h1>
            }
            steps={steps}
            style={{
              width: "40vw",
              height: "80vh",
              whiteSpace: "pre-line",
              fontFamily: "Helvetica",
              marginBottom: "20px",
              transformOrigin: "right bottom",
              transition:
                "width 200ms ease 0s, height 200ms ease 0s, max-height 200ms ease 0s, transform 300ms cubic-bezier(0, 1.2, 1, 1) 0s, opacity 83ms ease-out 0s"
            }}
          />
        )}
        <div
          style={{
            background: "#FF0000",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "100%"
          }}
          onClick={handleClick}
        >
          <div
            style={{
              display: showChatbot ? "none" : "block",
              width: "24px",
              height: "24px"
            }}
          >
            <svg
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 28 32"
              fill="white"
              width="24"
              height="24"
            >
              <path d="M28,32 C28,32 23.2863266,30.1450667 19.4727818,28.6592 L3.43749107,28.6592 C1.53921989,28.6592 0,27.0272 0,25.0144 L0,3.6448 C0,1.632 1.53921989,0 3.43749107,0 L24.5615088,0 C26.45978,0 27.9989999,1.632 27.9989999,3.6448 L27.9989999,22.0490667 L28,22.0490667 L28,32 Z M23.8614088,20.0181333 C23.5309223,19.6105242 22.9540812,19.5633836 22.5692242,19.9125333 C22.5392199,19.9392 19.5537934,22.5941333 13.9989999,22.5941333 C8.51321617,22.5941333 5.48178311,19.9584 5.4277754,19.9104 C5.04295119,19.5629428 4.46760991,19.6105095 4.13759108,20.0170667 C3.97913051,20.2124916 3.9004494,20.4673395 3.91904357,20.7249415 C3.93763774,20.9825435 4.05196575,21.2215447 4.23660523,21.3888 C4.37862552,21.5168 7.77411059,24.5386667 13.9989999,24.5386667 C20.2248893,24.5386667 23.6203743,21.5168 23.7623946,21.3888 C23.9467342,21.2215726 24.0608642,20.9827905 24.0794539,20.7254507 C24.0980436,20.4681109 24.0195551,20.2135019 23.8614088,20.0181333 Z"></path>
            </svg>
          </div>
          <div
            style={{
              display: !showChatbot ? "none" : "block",
              width: "24px",
              height: "24px"
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z"
                fill="white"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Chatbot;
