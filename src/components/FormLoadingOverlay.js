/**
 * Form loading overlay.
 * 
 * Component that displays a loading overlay over a form.
 * Used for UX to indicate that the form is loading.
 */
const FormLoadingOverlay = () => {
    return (
        <div className="pf-form-loading-overlay">
            <div className="pf-form-loading-animation"></div>
        </div>
    )
};
export default FormLoadingOverlay;

