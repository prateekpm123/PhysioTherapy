

import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeColorPallate from "../../../../assets/ThemeColorPallate";

interface iModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any;
    title: string;
    onActionButtonClick: () => void; // This will mostly be save or update function
    actionButtonText?: string;
}
const Modal = ({children, title, onActionButtonClick, actionButtonText}: iModalProps) => {
  const navigate = useNavigate();
  //   const { pid } = useParams();
  const onClose = () => {
    // navigate("/doctorhome/main/patientDetails/" + pid + "/buildPlan");
    navigate(-1);
    // console.log("closing modal");
  };
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background with transparency
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Ensure it's on top
      }}
      onClick={onClose} // Close modal on background click
    >
      <div
        style={{
          backgroundColor: ThemeColorPallate.background, // Darker modal background
          padding: '20px',
          borderRadius: '8px',
          height: "80%",
          width: '80%', // Adjust as needed
        //   maxWidth: '800px', // Adjust as needed
          position: 'relative',
          overflow: 'auto', // Allow scrolling if content overflows
          maxHeight: '90vh', // Limit height and allow scrolling
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
      >
        <h2 style={{ color: 'white', fontSize:"30px", marginBottom: '20px', textAlign: 'left' }}>{title}</h2>
        {children}
        <div style={{ position: 'absolute', bottom: '20px', right: '30px', display: 'flex', height: "40px" }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              marginRight: '20px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onActionButtonClick}
            style={{
              background: '#007bff', // Example primary color
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {actionButtonText || 'Save'} {/* Default to 'Save' */}  
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
