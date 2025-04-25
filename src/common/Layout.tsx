
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Header } from './Header'
import Footer from './Footer'


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.wrapper}>
      <Header />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 16 },
})
