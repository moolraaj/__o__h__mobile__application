
import AllLesionsRecords from '../../components/lesion/LesionsRecords';
import { Layout } from '../../common/Layout';
 
import React from 'react';
 


const AllLesionsScreen = ({ navigation }:{navigation:any}) => {
   

    return (

        <>

            <Layout>
                 <AllLesionsRecords navigation={navigation}/>

            </Layout>
        </>



    );
};

export default AllLesionsScreen;
