import React, { useEffect, useState } from "react";
import ChatBot from "react-simple-chatbot";
import styled from "styled-components";

const Chatbotwrapper = styled.div`
  @media (width < 768px) {
    & .rsc-container {
      width: 90vw !important;
    }
    & .rsc-content {
      width: 90vw !important;
    }
  }
  & .rsc-os-options {
    display: flex;
    flex-direction: column;
  }
  & .cRmLCo {
    margin-left: 80px;
  }
  & .hiMqtA {
    margin-left: 80px;
  }
  & .iOCYje {
    background: #ccc !important;
  }
`;

const ReloadButton = styled.div`
  transition: transform 0.3s ease;
  &:hover {
    transform: rotate(270deg);
  }
`;

const Review = props => {
  const name = props.steps["enter-name"]?.value;
  const birthday = props.steps["enter-birthday"]?.value;
  const email = props.steps["enter-email"]?.value;
  const phoneNumber = props.steps["enter-phone-number"]?.value;
  const day = props.steps["choose-day"]?.value;
  const time = props.steps["choose-time-preference"]?.value;
  const insuranceProvider = props.steps["enter-insurance-provider"]?.value;
  const insuranceId = props.steps["enter-insurance-id"]?.value;
  return (
    <div>
      <table
        style={{
          width: "100%",
          tableLayout: "fixed"
        }}
      >
        <tbody>
          <tr>
            <td>Name</td>
            <td>{name}</td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>{birthday}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{email}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{phoneNumber}</td>
          </tr>
          <tr>
            <td>Appt Day</td>
            <td>{day}</td>
          </tr>
          <tr>
            <td>Appt time</td>
            <td>{time}</td>
          </tr>
          <tr>
            <td>Insurance</td>
            <td>{insuranceProvider}</td>
          </tr>
          <tr>
            <td>Insurance ID</td>
            <td>{insuranceId}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Chatbot = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [key, setKey] = useState(0);
  const [favicon, setFavicon] = useState("");
  const [steps, setSteps] = useState([
    {
      id: "1",
      message: "Please choose your language.",
      trigger: "lang"
    },
    {
      id: "lang",
      options: [
        { value: "en", label: "English", end: true },
        { value: "es", label: "Español", end: true }
      ]
    }
  ]);
  const [clinicName, setClinicName] = useState(0);

  useEffect(() => {
    const currentParam = new URLSearchParams(window.location.search);
    fetch(`/chatbot-name/${currentParam.get("id")}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        setClinicName(data.name);
        setFavicon(data.favicon);
      })
      .catch(err => {
        console.log(err);
      });
  }, [clinicName]);

  const handleNameValidation = value => {
    // Name validation logic
    if (value.trim().length === 0) {
      return "Please enter a valid name.";
    }
    return true;
  };

  const handlePhoneValidation = value => {
    // Phone number validation logic
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) {
      return "Please enter a valid 10-digit phone number.";
    }
    return true;
  };

  const validateBirthday = value => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (!dateRegex.test(value)) {
      return "Please enter a valid date in the format MM/DD/YYYY.";
    }
    return true;
  };

  const newSteps = steps?.map(child => {
    if (child.id === "enter-name" || child.id === "question-enter-name") {
      return {
        ...child,
        validator: handleNameValidation
      };
    } else if (
      child.id === "enter-phone-number" ||
      child.id === "question-enter-phone-number"
    ) {
      return {
        ...child,
        validator: handlePhoneValidation
      };
    } else if (child.id === "enter-birthday") {
      return {
        ...child,
        validator: validateBirthday
      };
    } else if (child.id === "review") {
      return {
        ...child,
        component: <Review />
      };
    } else if (child.id === "mapLocation") {
      const html = child.component;
      return {
        ...child,
        component: (
          <div id="location" dangerouslySetInnerHTML={{ __html: html }} />
        )
      };
    }
    return child;
  });

  const returnState = () => {
    setSteps([
      {
        id: "1",
        message: "Please choose your language.",
        trigger: "lang"
      },
      {
        id: "lang",
        options: [
          { value: "en", label: "English", end: true },
          { value: "es", label: "Español", end: true }
        ]
      }
    ]);
    setKey(0);
  };

  const handleClick = () => {
    setShowChatbot(!showChatbot);
    setIsOpened(true);
  };
  const handleEnd = value => {
    const currentSteps = value.steps;
    const lang = currentSteps.lang?.value;
    const currentParam = new URLSearchParams(window.location.search);
    const id = currentParam.get("id");
    if (lang) {
      fetch(`/chatbot-data/${id}/${lang}`)
        .then(async res => {
          return res.json();
        })
        .then(data => {
          setTimeout(() => {
            setSteps(JSON.parse(data.data));
            setKey(1);
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    }else{
      let payload = {}
      for(let step of value.renderedSteps){
        if(step.value){
          payload[step.id] = step.value
        }
      }

      fetch("/chatbot/message", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          payload: JSON.stringify(payload),
          clinic: currentParam.get("id"),
          sex: currentParam.get("sex") ?? "m",
          acronym: window.location.pathname.split("/")[2],
          lang: currentParam.get("lang")
        })
      })
    }
  };

  const BotButtonWrapper = styled.div`
    background-color: #0080ff !important;
    padding: 0;
    margin: 0;
    width: 86px;
    height: 58px;
    position: fixed;
    z-index: 10;
    right: 0;
    bottom: 38px;
    display: ${showChatbot ? "none" : "block"};
    border-radius: 28px 0 0 28px !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2), 0 6px 16px rgba(0, 0, 0, 0.1) !important;
    cursor: pointer;
    text-align: start;

    &:hover {
      & div {
        visibility: visible !important;
        opacity: 1;
      }
    }

    &:before {
      height: 50px;
      width: 50px;
      content: " ";
      background: url("${favicon}") center center/cover no-repeat;
      border-radius: 25px;
      position: absolute;
      z-index: 11;
      top: 50%;
      transform: translate3d(5px, -50%, 0);
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2) !important;
    }

    & div {
      visibility: hidden !important;
      position: absolute;
      background-color: #fff;
      border-radius: 5px 0 0 28px !important;
      max-width: 380px !important;
      max-height: 200px !important;
      padding: 10px 40px 10px 10px !important;
      cursor: default;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.1) !important;
      right: 0;
      bottom: 0;
      z-index: 10;
      opacity: 0;
      width: auto !important;
      min-height: 58px !important;
      box-sizing: border-box !important;
      transform-origin: 50% 50% !important;
      transition: all 0.5s !important;
    }
    & button {
      color: #fff;
      font-weight: 500 !important;
      font-size: 16px;
      padding: 10px 60px !important;
      margin: 0;
      background-color: #0080ff;
      border: none;
      border-radius: 100px !important;
      display: inline;
      white-space: nowrap !important;
      cursor: pointer;
    }
    & p {
      margin: 0;
      text-align: center;
      font-weight: 700;
      color: #575757 !important;
      padding: 0px 10px;
      margin-bottom: 30px !important;
      font-size: 15px;
    }
  `;

  return (
    <React.Fragment>
      <Chatbotwrapper
        style={{
          position: "fixed",
          bottom: "38px",
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "end"
        }}
      >
        {isOpened && (
          <ChatBot
            key={key}
            botDelay={1000}
            handleEnd={handleEnd}
            botAvatar={favicon}
            bubbleOptionStyle={{
              fontSize: "22px",
              marginLeft: "86px",
              textAlign: "start",
              background: "#4040ff"
            }}
            bubbleStyle={{
              fontSize: "22px",
              fontFamily: "Arial",
              background: "#0080ff",
            }}
            contentStyle={{
              width: "600px",
              flexGrow: 1,
              fontFamily: "Arial"
            }}
            avatarStyle={{
              width: "80px",
              height: "80px"
            }}
            inputStyle={{
              fontSize: "22px"
            }}
            headerComponent={
              <h1
                style={{
                  fontSize: "32px",
                  textAlign: "center",
                  background: "#0080ff",
                  color: "white",
                  margin: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px"
                }}
              >
                <span style={{ flexGrow: 1 }}>{clinicName}</span>
                <ReloadButton
                  style={{
                    width: "30px",
                    height: "30px",
                    marginRight: "10px",
                    cursor: "pointer"
                  }}
                  onClick={returnState}
                >
                  <svg
                    fill="#fff"
                    height="30px"
                    width="30px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 489.645 489.645"
                  >
                    <g>
                      <path
                        d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3
		c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5
		c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8
		c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2
		C414.856,432.511,548.256,314.811,460.656,132.911z"
                      />
                    </g>
                  </svg>
                </ReloadButton>
              </h1>
            }
            steps={newSteps}
            style={{
              textAlign: "start",
              marginRight: "20px",
              display: !showChatbot ? "none" : "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "600px",
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
        <BotButtonWrapper onClick={handleClick}>
          <div>
            <p>
              <strong>What brings you here today?</strong>
            </p>
            <button>CHAT LIVE NOW</button>
          </div>
        </BotButtonWrapper>
        <div
          style={{
            display: !showChatbot ? "none" : "flex",
            background: "#0080ff",
            width: "48px",
            height: "48px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "100%",
            cursor: "pointer"
          }}
          onClick={handleClick}
        >
          <div
            style={{
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
      </Chatbotwrapper>
    </React.Fragment>
  );
};
export default Chatbot;