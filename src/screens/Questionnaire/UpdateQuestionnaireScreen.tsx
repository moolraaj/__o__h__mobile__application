import { Layout } from '../../common/Layout'
import UpdateQuestionnaire from '../../components/Questionnaire/UpdateQuestionnaire'
import React from 'react'

function UpdateQuestionnaireScreen({ navigation }: { navigation: any }) {
    return (
        <>
            <Layout>
                <UpdateQuestionnaire navigation={navigation} />
            </Layout>
        </>
    )
}

export default UpdateQuestionnaireScreen