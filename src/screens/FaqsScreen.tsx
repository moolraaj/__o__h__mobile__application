import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Layout } from '../common/Layout';
import { useGetFaqsQuery } from '../store/services/faqs/faqsApi';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import RenderHtml from 'react-native-render-html';
import { AppError } from '../common/AppError';

export default function FaqsScreen() {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'kn';
  const { width } = useWindowDimensions();
  const { data, isLoading, error, refetch } = useGetFaqsQuery({
    page: 1,
    limit: 10,
    lang,
  });

  // Treat data.result as an array of FAQ groups
  const faqGroups = data?.result ?? [];
  // expanded holds the key "groupIdx-questionIdx" of the open item
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return <AppError onRetry={refetch} />;
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        {faqGroups.map((group, gIdx) => (
          <View key={group._id ?? gIdx} style={styles.groupContainer}>
            {/* Group Title */}
            <Text style={styles.groupTitle}>
              {group.faqs_title?.[lang] ?? 'FAQs'}
            </Text>

            {/* Questions */}
            {group.faqs_repeater.map((item, qIdx) => {
              const key = `${gIdx}-${qIdx}`;
              const isOpen = expanded === key;
              const question = item.question?.[lang] ?? '';
              const answerHtml = item.answer?.[lang] ?? '';

              return (
                <View key={qIdx} style={styles.itemContainer}>
                  {/* Question Header */}
                  <LinearGradient
                    colors={['#E8F4FF', '#DDEFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.questionHeader}
                  >
                    <TouchableOpacity
                      style={styles.questionRow}
                      onPress={() =>
                        setExpanded(prev => (prev === key ? null : key))
                      }
                    >
                      <Text style={styles.questionText}>{question}</Text>
                      <Entypo
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#333"
                      />
                    </TouchableOpacity>
                  </LinearGradient>

                  {/* Answer Body */}
                  {isOpen && (
                    <View style={styles.answerContainer}>
                      <RenderHtml
                        contentWidth={width - 32}
                        source={{ html: answerHtml }}
                        tagsStyles={{
                          p: styles.answerText,
                          br: { height: 8 },
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#5E346D',
  },
  itemContainer: {
    marginBottom: 16,
  },
  questionHeader: {
    borderRadius: 8,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  answerContainer: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
});
