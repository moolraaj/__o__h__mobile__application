import { Text } from 'react-native'
import React from 'react'
import { Layout } from '../common/Layout'
import BackButton from '../resuable/BackButton'

const DiseaseScreen = () => {
  return (
    <Layout>
      <BackButton onPress={function (): void {
        throw new Error('Function not implemented.')
      }} />
      <Text>DiseaseScreen</Text>
    </Layout>

  )
}

export default DiseaseScreen