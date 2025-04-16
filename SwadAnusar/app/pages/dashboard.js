import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  ScrollView, 
  FlatList, 
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Dashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUserEmail = await AsyncStorage.getItem('userEmail');
        const currentUserId = await AsyncStorage.getItem('userId');
        
        if (!currentUserEmail) {
          console.log("No user email found");
          setLoading(false);
          return;
        }

        const usersRef = collection(FIREBASE_DB, 'users');
        const q = query(usersRef, where('email', '!=', currentUserEmail));
        const querySnapshot = await getDocs(q);

        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

// Update handleUserPress in dashboard.js
const handleUserPress = async (user) => {
  const currentUserId = await AsyncStorage.getItem('userId');
  
  navigation.navigate('ChatBox', { 
    chatType: 'individual',
    chatId: user.id,
    currentUserId: currentUserId, // Pass current user ID
    chatName: user.name || user.email.split('@')[0]
  });
};

  const handleGroupPress = (groupName, groupId) => {
    navigation.navigate('ChatBox', { 
      chatType: 'group',
      chatId: groupId,
      chatName: groupName
    });
  };

  // Hardcoded groups for demonstration
  const groups = [
    { id: 'tanwar_family', name: 'Tanwar Family' },
    { id: 'uf_roomies', name: 'UF Roomies' },
    { id: 'dostis', name: 'Dostis' }
  ];

  return (
    <ImageBackground
      source={require('../../assets/images/homepage.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Swad Anusar</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : (
          <ScrollView style={styles.chatList}>
            {/* Group Chats Section */}
            <Text style={styles.sectionHeader}>Group Chats</Text>
            {groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.chatTab}
                onPress={() => handleGroupPress(group.name, group.id)}
              >
                <Image 
                  source={require('../../assets/images/group-icon.png')} 
                  style={styles.chatIcon}
                />
                <Text style={styles.chatText}>{group.name}</Text>
              </TouchableOpacity>
            ))}

            {/* Users Section */}
            <Text style={styles.sectionHeader}>Individual Chats</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userTab}
                  onPress={() => handleUserPress(item)}
                >
                  <Image 
                    source={item.photoURL ? 
                      { uri: item.photoURL } : 
                      require('../../assets/images/user.png')} 
                    style={styles.userIcon}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {item.name || item.email.split('@')[0]}
                    </Text>
                    <Text style={styles.userStatus}>
                      {item.status || 'Hey there! I am using Swad Anusar'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#D64527',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  chatList: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#555',
  },
  chatTab: {
    backgroundColor: '#D64527',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTab: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  chatIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    tintColor: '#FFF',
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userStatus: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  chatText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Dashboard;