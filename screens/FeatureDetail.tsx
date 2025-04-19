
import React from 'react'
import SingleFeature from '../components/SingleFeature'
import { Layout } from '../common/Layout'
const FeatureDetail = ({ navigation }: { navigation: any }) => {
  return (
    <Layout>
      <SingleFeature navigation={navigation} />
    </Layout>
  )
}
export default FeatureDetail