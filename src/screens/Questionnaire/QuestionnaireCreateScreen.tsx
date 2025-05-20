import { Layout } from '../../common/Layout'
import CreateQuestionnaire from '../../components/Questionnaire/CreateQuestionnaire'
import React from 'react'

function QuestionnaireCreateScreen({ navigation }: { navigation: any }) {
  return (
    <>
      <Layout>
        <CreateQuestionnaire navigation={navigation} />
      </Layout>
    </>
  )
}

export default QuestionnaireCreateScreen