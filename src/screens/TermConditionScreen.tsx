import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Layout } from '../common/Layout';
 
import { useTranslation } from 'react-i18next';
import RenderHtml from 'react-native-render-html';
import { AppError } from '../common/AppError';
import { useGetTermsQuery } from '../store/services/terms/termsApi';

export default function TermConditionScreen() {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'kn';
  const { width } = useWindowDimensions();

  const { data, isLoading, error, refetch } = useGetTermsQuery({
    page: 1,
    limit: 10,
    lang,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data?.result?.length) {
    return <AppError onRetry={refetch} />;
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {data.result.map((termEntry, entryIdx) =>
          termEntry.terms_repeater.map((item, idx) => {
            const heading = item.term_heading?.[lang] ?? '';
            const html = item.term_description?.[lang] ?? '';
            return (
              <View key={`${entryIdx}-${idx}`} style={styles.section}>
                <Text style={styles.heading}>{heading}</Text>
                <RenderHtml
                  contentWidth={width - 32}
                  source={{ html }}
                  tagsStyles={{ p: styles.paragraph }}
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 24 },
  heading: { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#333' },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginBottom: 12,
  },
});
