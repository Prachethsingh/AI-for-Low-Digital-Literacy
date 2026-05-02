/**
 * SchemeListScreen — list of eligible/all schemes.
 * MD3: Surface, Button, Avatar, Text, FlatList. No hardcoded hex.
 */
import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, useWindowDimensions } from 'react-native';
import { Text, Button, useTheme, Surface, Avatar } from 'react-native-paper';
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
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const headerPadding = isLargeScreen ? 32 : 24;
  const titleSize = isLargeScreen ? 'headlineLarge' : 'headlineMedium';

  const isKan = language === 'kannada';

  const filtered =
    schemeIds.length > 0 ? SCHEMES.filter(s => schemeIds.includes(s.id)) : SCHEMES;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Surface
        style={[styles.header, { backgroundColor: theme.colors.primary }]}
        elevation={2}
      >
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor={theme.colors.onPrimary}
          icon="chevron-left"
          compact
        >
          {isKan ? 'ಹಿಂದೆ' : 'Back'}
        </Button>
        <LanguageToggle />
      </Surface>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <Text
              variant={titleSize}
              style={[styles.title, { color: theme.colors.primary }]}
            >
              {isKan ? 'ನಿಮಗಾಗಿ ಯೋಜನೆಗಳು' : 'Schemes for You'}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {isKan
                ? `ಒಟ್ಟು ${filtered.length} ಯೋಜನೆಗಳು ಸಿಕ್ಕಿವೆ`
                : `Found ${filtered.length} scheme${filtered.length === 1 ? '' : 's'} for you`}
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
            <Avatar.Icon
              size={80}
              icon="alert-circle-outline"
              style={{ backgroundColor: theme.colors.errorContainer }}
              color={theme.colors.onErrorContainer}
            />
            <Text
              variant="titleMedium"
              style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
            >
              {isKan ? 'ಕ್ಷಮಿಸಿ, ಯಾವುದೇ ಯೋಜನೆ ಸಿಗಲಿಲ್ಲ.' : 'Sorry, no matching schemes found.'}
            </Text>
            <Button
              mode="contained"
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              {isKan ? 'ಹಿಂದೆ ಹೋಗಿ' : 'Go Back'}
            </Button>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerInfo: { paddingVertical: 24 },
  title: { fontWeight: '900' },
  subtitle: { marginTop: 4 },
  list: { paddingBottom: 40 },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 8,
    borderRadius: 16,
  },
});
