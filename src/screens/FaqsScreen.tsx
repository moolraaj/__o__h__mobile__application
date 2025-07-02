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
import GradientText from '../common/GradientText';


export default function FaqsScreen() {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'kn';
  const { width } = useWindowDimensions();
  const { data, isLoading, error, refetch } = useGetFaqsQuery({
    page: 1,
    limit: 10,
    lang,
  });

  const faqGroups = data?.result ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Layout>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6e3b7a" />
        </View>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <AppError onRetry={refetch} />
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {faqGroups.map((group, gIdx) => (
          <View key={group._id ?? gIdx} style={styles.groupContainer}>
            {/* Group Title */}
            <Text style={styles.groupTitle}>
              <GradientText text={group.faqs_title?.[lang] ?? 'FAQs'} size={20}/>
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
                    colors={isOpen ? ['#6e3b7a', '#8e5a9b'] : ['#E8F4FF', '#DDEFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[isOpen && styles.activeHeader]}
                  >
                    <TouchableOpacity
                      style={styles.questionRow}
                      onPress={() =>
                        setExpanded(prev => (prev === key ? null : key))
                      }
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[styles.questionText, isOpen && styles.activeQuestionText]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {question}
                      </Text>
                      <View style={[styles.questionIcon, isOpen && styles.questionIconActive]}>
                        <Entypo
                          name={isOpen ? 'minus' : 'plus'}
                          size={18}
                          color={isOpen ? '#fff' : '#5D3FD3'}
                        />
                      </View>
                    </TouchableOpacity>
                  </LinearGradient>

                  {/* Answer Body */}
                  {isOpen && (
                    <View style={styles.answerContainer}>
                      <RenderHtml
                        contentWidth={width - 40}
                        source={{ html: answerHtml }}
                        tagsStyles={{
                          p: styles.answerText,
                          br: { height: 8 },
                          ul: { marginTop: 0, marginBottom: 0 },
                          li: { marginBottom: 4 },
                        }}
                        baseStyle={styles.htmlBaseStyle}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#6e3b7a',
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6e3b7a',
  },
  itemContainer: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#808080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  activeHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  activeQuestionText: {
    color: '#fff',
  },
  questionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionIconActive: {
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerContainer: {
    backgroundColor: '#f9f5fa',
    padding: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  htmlBaseStyle: {
    color: '#555',
    fontSize: 15,
    lineHeight: 22,
  },
});