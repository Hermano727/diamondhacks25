import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/100' }} 
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>Guest User</Text>
              <Text style={styles.email}>guest@example.com</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="person-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
                <View style={styles.menuIcon}>
                  <Ionicons name="lock-closed-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>Change Password</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="notifications-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
                <View style={styles.menuIcon}>
                  <Ionicons name="color-palette-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>Appearance</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
                <View style={styles.menuIcon}>
                  <Ionicons name="language-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>Language</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="help-circle-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]}>
                <View style={styles.menuIcon}>
                  <Ionicons name="information-circle-outline" size={24} color="#1a237e" />
                </View>
                <Text style={styles.menuText}>About</Text>
                <Ionicons name="chevron-forward" size={20} color="#1a237e" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#1a237e',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
}); 