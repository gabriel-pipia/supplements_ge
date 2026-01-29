import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useApp } from '../../context';
import { Language } from '../../constants/translations';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path } from 'react-native-svg';

const IconCheck = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const languages: { id: Language; name: string; nativeName: string; flag: string }[] = [
  { id: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
];

export const LanguageModal: React.FC = () => {
  const { colors, language, setLanguage, isLanguageModalVisible, hideLanguageModal, t, isDark } = useApp();

  if (!isLanguageModalVisible) return null;

  return (
    <Modal
      visible={isLanguageModalVisible}
      transparent
      onRequestClose={hideLanguageModal}
      animationType="none"
    >
      <BottomSheetModal 
        onClose={hideLanguageModal} 
        height={Platform.OS === 'web' ? 'auto' : '45%'}
        safeAreaEdges={['bottom']}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('selectLanguage')}
          </Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
            onPress={hideLanguageModal}
          >
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {t('selectLanguageDesc')}
          </Text>

          {/* Language Options */}
          <View style={styles.options}>
            {languages.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.option,
                    { 
                      backgroundColor: colors.surface,
                      borderColor: isSelected ? colors.accent : colors.gray100,
                      borderWidth: 1,
                    }
                  ]}
                  onPress={() => {
                    setLanguage(lang.id);
                    setTimeout(hideLanguageModal, 300);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionName, { color: colors.text }]}>
                      {lang.nativeName}
                    </Text>
                    <Text style={[styles.optionSubname, { color: colors.textMuted }]}>
                      {lang.name}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkCircle, { backgroundColor: colors.accent }]}>
                      <IconCheck size={14} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheetModal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   paddingHorizontal: 24,
    padding: Platform.OS == "web" ? 20 : 0,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '500',
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionSubname: {
    fontSize: 13,
    fontWeight: '500',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
