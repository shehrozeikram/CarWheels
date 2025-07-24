import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, I18nManager, Image } from 'react-native';


const ChatScreen = ({ navigation }) => {


  const handleSellOption = (option) => {
    setSellModalVisible(false);
    console.log('Selected sell option:', option);
    // Handle different sell options here
  };



  return (
    <SafeAreaView style={[styles.safeArea, { direction: 'ltr' }]}>
      <View style={[styles.container, { direction: 'ltr' }]}>
        {/* iOS blue status bar area */}
        {Platform.OS === 'ios' && <SafeAreaView style={{ backgroundColor: '#900C3F' }} />}
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/images/back_arrow.png')} style={styles.backArrowImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chats</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Chat Icons */}
          <View style={styles.chatIconsContainer}>
            <View style={styles.chatIconBack}>
              <View style={styles.chatIconBackInner}>
                <View style={styles.chatIconBackLines}>
                  <View style={styles.chatIconLine} />
                  <View style={styles.chatIconLine} />
                </View>
              </View>
            </View>
            <View style={styles.chatIconFront}>
              <View style={styles.chatIconFrontInner}>
                <View style={styles.chatIconFrontLines}>
                  <View style={styles.chatIconLine} />
                  <View style={styles.chatIconLine} />
                </View>
              </View>
            </View>
          </View>
          
          <Text style={styles.noMessagesTitle}>No Messages, yet</Text>
          <Text style={styles.noMessagesSubtitle}>
            You'll find all your messages right here, Get started.
          </Text>
          
          <TouchableOpacity style={styles.startExploringButton} onPress={() => navigation.navigate('CarListScreen', { model: 'New Cars' })}>
            <Text style={styles.startExploringText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>


      </View>
      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#900C3F', paddingBottom: 40, direction: 'ltr' },
  container: { flex: 1, backgroundColor: '#fff', direction: 'ltr' },
  header: {
    backgroundColor: '#900C3F',
    paddingTop: Platform.OS === 'ios' ? 10 : 36,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginLeft: 2,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 30,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  chatIconsContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  chatIconBack: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 80,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconBackInner: {
    width: 60,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconBackLines: {
    width: 40,
  },
  chatIconFront: {
    width: 80,
    height: 60,
    backgroundColor: '#900C3F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconFrontInner: {
    width: 60,
    height: 40,
    backgroundColor: '#900C3F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIconFrontLines: {
    width: 40,
  },
  chatIconLine: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 6,
    width: '100%',
  },
  noMessagesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMessagesSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  startExploringButton: {
    backgroundColor: '#900C3F',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  startExploringText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default ChatScreen; 