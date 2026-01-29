import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path, Circle } from 'react-native-svg';
import { Modal } from 'react-native';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const IconPhone = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const IconMail = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="m22 6-10 7L2 6" />
  </Svg>
);

// Social Media Icons
const IconInstagram = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M17.5 6.5h.01" strokeLinecap="round" />
    <Path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
    <Circle cx="12" cy="12" r="4" />
  </Svg>
);

const IconFacebook = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const IconTikTok = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </Svg>
);

const IconWhatsApp = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const { colors, t } = useApp();
  const insets = useSafeAreaInsets();

  const HelpItem = ({ icon: Icon, label, value }: any) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.accent }]}>
        <Icon size={24} color={colors.text} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.itemValue, { color: colors.text }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  const SocialButton = ({ icon: Icon, label }: any) => (
    <TouchableOpacity 
      style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}
      activeOpacity={0.7}
    >
      <Icon size={20} color={colors.accent} />
      <Text style={[styles.socialLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <BottomSheetModal onClose={onClose} height="100%" showDragHandle={true}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('help') || 'Help & Support'}</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.gray100 }]} onPress={onClose}>
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
          <HelpItem icon={IconPhone} label="Call Us" value="+995 5xx xxx xxx" />
          <HelpItem icon={IconMail} label="Email Us" value="support@supplements.ge" />
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>FAQ</Text>
          <TouchableOpacity style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqText, { color: colors.text }]}>How to track my order?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqText, { color: colors.text }]}>Return Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.faqItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.faqText, { color: colors.text }]}>Shipping Information</Text>
          </TouchableOpacity>

          {/* Social Media Links */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Follow Us</Text>
          <View style={styles.socialGrid}>
            <SocialButton icon={IconInstagram} label="Instagram" />
            <SocialButton icon={IconFacebook} label="Facebook" />
            <SocialButton icon={IconTikTok} label="TikTok" />
            <SocialButton icon={IconWhatsApp} label="WhatsApp" />
          </View>
          
          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>
              Supplements.ge v1.0.0
            </Text>
          </View>
        </ScrollView>
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
    paddingBottom: 16,
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
  scrollContent: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  faqItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  faqText: {
    fontSize: 16,
    fontWeight: '500',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
    minWidth: '47%',
    borderWidth: 1,
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
