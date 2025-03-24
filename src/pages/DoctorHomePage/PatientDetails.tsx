import { useCurrentMainScreenContext } from "./DoctorHomePage";

const PatientDetails = () => {
    const {currentPatientDetails} = useCurrentMainScreenContext();
    return (
        <div>
            {currentPatientDetails?.name}
            PatientDetails
        </div>
    );
}

export default PatientDetails;