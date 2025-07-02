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
import GradientText from '../common/GradientText';

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
      <Layout>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </Layout>
    );
  }

  if (error || !data?.result?.length) {
    return <Layout><AppError onRetry={refetch} /></Layout>;
  }

  return (
    <Layout>
      <ScrollView>
        {data.result.map((termEntry, entryIdx) =>
          termEntry.terms_repeater.map((item, idx) => {
            const heading = item.term_heading?.[lang] ?? '';
            const html = item.term_description?.[lang] ?? '';
            return (
              <View key={`${entryIdx}-${idx}`} style={styles.section}>
                <Text style={styles.heading}>
                  <GradientText text={heading} size={18} />
                </Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 12 },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#3D3D4E',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
});
