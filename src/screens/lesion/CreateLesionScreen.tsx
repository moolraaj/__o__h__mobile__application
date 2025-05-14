
import { Layout } from '../../common/Layout';
import CreateLesion from '../../components/lesion/CreateLesion';
const CreateLesionScreen = ({ navigation }: { navigation: any }) => {
    return (
        <>
            <Layout>
                <CreateLesion navigation={navigation} />
            </Layout>
        </>
    );
};
export default CreateLesionScreen;
