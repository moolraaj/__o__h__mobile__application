import QuestionnaireLists from '../../components/Questionnaire/AllQuestionnaireList'
import React from 'react'

function AllQuestionnaire({ navigation }: { navigation: any }) {
    return (
        <>
            <QuestionnaireLists navigation={navigation} />
        </>
    )
}

export default AllQuestionnaire