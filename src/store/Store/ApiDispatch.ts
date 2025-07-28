 
import { AppDispatch } from './Store';  

 
import { apiSlice } from '../services/apiSlice'

export const invalidateAllCompanyApis = (dispatch: AppDispatch) => {
    dispatch(apiSlice.util.invalidateTags(['User', 'Slider', 'TextSlider', 'Disease', 'Category', 'HabitHealth', 'Lesions', 'Questions', 'MythsFacts', 'Questionnaire', 'Dental']));
};
