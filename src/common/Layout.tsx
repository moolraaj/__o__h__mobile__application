import React from 'react'
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import { Header } from './Header'
import Footer from './Footer'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
})
