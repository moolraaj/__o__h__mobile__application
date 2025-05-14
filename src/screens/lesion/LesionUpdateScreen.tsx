import React from 'react';
 
import UpdateLesion from '../../components/lesion/UpdateLesion';
import { Layout } from '../../common/Layout';

const LesionUpdateScreen = ({ navigation }: { navigation: any }) => {


    return (
        <>
        <Layout>
            <UpdateLesion navigation={navigation} />
        </Layout>
        </>
    );
};



export default LesionUpdateScreen;
