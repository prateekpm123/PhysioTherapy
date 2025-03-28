// import { Flex, Heading, Text, Button } from "@radix-ui/themes";
// import { Box, Flex, Card } from "@radix-ui/themes";
// import * as Dialog from "@radix-ui/react-dialog";
// import { styled } from "@stitches/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastColors } from "../../../../components/Toast";
import { deleteOriginalExcercise } from "../../../../controllers/ExcerciseController";
import { iExcerciseDataDto } from "../../../../models/ExcerciseInterface";
import { DefaultToastTiming, useToast } from "../../../../stores/ToastContext";
import { useCurrentMainScreenContext } from "../../DoctorHomePage";

// const StyledOverlay = styled(Dialog.Overlay, {
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   position: "fixed",
//   inset: 0,
// });

// const StyledContent = styled(Dialog.Content, {
//   backgroundColor: "#111", // Dark background
//   borderRadius: 6,
//   boxShadow:
//     "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
//   position: "fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90vw",
//   maxWidth: "500px",
//   maxHeight: "85vh",
//   padding: 25,
//   "&:focus": { outline: "none" },
// });

// const StyledTitle = styled(Dialog.Title, {
//   margin: 0,
//   fontWeight: 500,
//   fontSize: 17,
//   color: "white", // White text
// });

// const StyledDescription = styled(Dialog.Description, {
//   margin: "10px 0 20px",
//   color: "gray", // Gray text
//   fontSize: 15,
//   lineHeight: 1.5,
// });

//   const Flex = styled('div', {
//     display: 'flex',
//     justifyContent: 'flex-end',
//     gap: 15,
//   });

// const StyledButton = styled("button", {
//   all: "unset",
//   display: "inline-flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: 4,
//   padding: "10px 15px",
//   fontSize: 15,
//   lineHeight: 1,
//   fontWeight: 500,
//   cursor: "pointer",
//   "&:focus": { boxShadow: `0 0 0 2px black` },
// });

// const CancelButton = styled(StyledButton, {
//   backgroundColor: "transparent",
//   border: "1px solid gray",
//   color: "white",
// });

// const DeleteButton = styled(StyledButton, {
//   backgroundColor: "#D11A2A", // Red background
//   color: "white",
// });

export interface iDialogBoxInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActionButtonClick?: (data: any) => void;
  onCloseButtonClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionButtonClickParams?: any;
  title: string;
  message: string;
  actionButtonText: string;
  closeButtonText: string;
}

const DeleteExcercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    onCloseButtonClick,
    actionButtonClickParams,
    title,
    message,
    actionButtonText,
    closeButtonText,
  } = location.state as iDialogBoxInterface;


  const {setIsExcerciseBuilderRefresh, isExcerciseBuilderRefresh} = useCurrentMainScreenContext();
  const {showToast} = useToast();

  const deleteExcercise = async () => {
      try {
        const excercise: iExcerciseDataDto = actionButtonClickParams;
        deleteOriginalExcercise({
          data: {
            e_id: excercise.e_id,
          },
          afterAPISuccess: (res) => {
            showToast(
              "Excercise deleted successfully",
              DefaultToastTiming,
              ToastColors.GREEN
            );
            navigate(-1);
            setIsExcerciseBuilderRefresh(!isExcerciseBuilderRefresh);
            console.log("Excercise deleted successfully:", res);
          },
          afterAPIFail: (res) => {
            showToast(res.message, DefaultToastTiming, ToastColors.RED);
            navigate(-1);
            // ErrorHandler(res);
            console.error("Excercise delete failed:", res);
          },
        });
      } catch (error) {
        console.error("Error deleting node:", error);
      }
    };

  const onClose = () => {
    navigate(-1);
  };
  
  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#222",
          padding: "20px",
          borderRadius: "8px",
          width: "80%",
          height: "300px",
          maxWidth: "500px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "15px", fontSize:"20px", fontWeight:"bolder", justifyContent:"left" }}>{title}</h2>
        <p style={{ marginBottom: "20px", fontSize:"18px", alignItems:"flex-start" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
          <button
            onClick={onCloseButtonClick || onClose}
            style={{
              padding: "10px 20px",
              border: "1px solid white",
              borderRadius: "5px",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            {closeButtonText || "Cancel"}
          </button>
          <button
            onClick={deleteExcercise}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              background: "#d32f2f", // Red color for delete
              color: "white",
              cursor: "pointer",
            }}
          >
            {actionButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExcercise;

// const DeleteAccountModal = ({ open, onOpenChange, onDelete }) => {
//   return (
//     <Dialog.Root open={open} onOpenChange={onOpenChange}>
//       <Dialog.Portal>
//         <StyledOverlay />
//         <StyledContent>
//           <StyledTitle>Are you absolutely sure?</StyledTitle>
//           <StyledDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </StyledDescription>
//           <Flex>
//             <CancelButton onClick={() => onOpenChange(false)}>
//               Cancel
//             </CancelButton>
//             <DeleteButton onClick={onDelete}>Yes, delete account</DeleteButton>
//           </Flex>
//         </StyledContent>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default DeleteAccountModal;

// import React from "react";

// const DeleteAccountModal = ({ onClose, onConfirm }) => {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.8)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 1000,
//       }}
//       onClick={onClose}
//     >
//       <div
//         style={{
//           backgroundColor: "#222",
//           padding: "20px",
//           borderRadius: "8px",
//           width: "80%",
//           maxWidth: "500px",
//           position: "relative",
//           color: "white",
//           textAlign: "center",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 style={{ marginBottom: "15px" }}>Are you absolutely sure?</h2>
//         <p style={{ marginBottom: "20px" }}>
//           This action cannot be undone. This will permanently delete your
//           account and remove your data from our servers.
//         </p>
//         <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
//           <button
//             onClick={onClose}
//             style={{
//               padding: "10px 20px",
//               border: "1px solid white",
//               borderRadius: "5px",
//               background: "transparent",
//               color: "white",
//               cursor: "pointer",
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             style={{
//               padding: "10px 20px",
//               border: "none",
//               borderRadius: "5px",
//               background: "#d32f2f", // Red color for delete
//               color: "white",
//               cursor: "pointer",
//             }}
//           >
//             Yes, delete account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteAccountModal;
