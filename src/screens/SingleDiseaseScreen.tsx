
import React from 'react'
import { Layout } from '../common/Layout'
import SingleDisease from '../components/SingleDisease'

const SingleDiseaseScreen = ({navigation}:{navigation:any}) => {
    return (
        <Layout>
            <SingleDisease navigation={navigation}/>
        </Layout>
    )
}

export default SingleDiseaseScreen