/**
 * SchemeListScreen – Shows the list of filtered schemes.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SCHEMES } from '../constants/schemes';
import { useAppContext } from '../context/AppContext';
import SchemeCard from '../components/SchemeCard';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeList'>;

export default function SchemeListScreen({ navigation, route }: Props) {
  const { schemeIds } = route.params;
  const { language } = useAppContext();

  // If IDs provided, filter. If empty, show all.
  const filtered = schemeIds.length > 0
    ? SCHEMES.filter(s => schemeIds.includes(s.id))
    : SCHEMES;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ {language === 'kannada' ? 'ಹಿಂದೆ' : 'Back'}</Text>
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <Text style={styles.title}>
              {language === 'kannada' ? 'ನಿಮಗಾಗಿ ಯೋಜನೆಗಳು' : 'Schemes for You'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'kannada'
                ? `ಒಟ್ಟು ${filtered.length} ಯೋಜನೆಗಳು ಸಿಕ್ಕಿವೆ`
                : `Found ${filtered.length} schemes you qualify for`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SchemeCard
            scheme={item}
            language={language}
            onPress={() => navigation.navigate('SchemeDetail', { schemeId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤷</Text>
            <Text style={styles.emptyText}>
              {language === 'kannada'
                ? 'ಕ್ಷಮಿಸಿ, ಯಾವುದೇ ಯೋಜನೆ ಸಿಗಲಿಲ್ಲ.'
                : 'Sorry, no matching schemes found.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F1E8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1B5E20',
  },
  backBtn: { padding: 4 },
  backText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  headerInfo: { paddingHorizontal: 24, paddingVertical: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#1B5E20' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { paddingBottom: 40 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
    lineHeight: 26,
  },
});
