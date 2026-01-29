import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { BottomSheetModal } from './BottomSheetModal'; // Resolves to .web
import Svg, { Path } from 'react-native-svg';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

// Icons
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

const webStyles = {
    pointer: { cursor: 'pointer' } as any,
    itemHover: {
        transition: 'background-color 0.2s',
    } as any,
}

export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const { colors, t } = useApp();

  const HelpItem = ({ icon: Icon, label, value }: any) => (
    <TouchableOpacity 
        style={[styles.item, { backgroundColor: colors.surface }, webStyles.pointer, webStyles.itemHover]}
        // @ts-ignore
        onMouseEnter={(e: any) => e.target.style.backgroundColor = colors.gray100}
        onMouseLeave={(e: any) => e.target.style.backgroundColor = colors.surface}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colors.background }]}>
        <Icon size={24} color={colors.text} />
      </View>
      <View style={styles.itemContent}>
        <Text style={[styles.itemLabel, { color: colors.textMuted }]}>{label}</Text>
        <Text style={[styles.itemValue, { color: colors.text }]}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <BottomSheetModal onClose={onClose} height="auto" showDragHandle={false}>
        <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t('help') || 'Help & Support'}</Text>
            <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: colors.gray100 }, webStyles.pointer]} 
                onPress={onClose}
            >
                <IconClose size={20} color={colors.text} />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
            <HelpItem icon={IconPhone} label="Call Us" value="+995 5xx xxx xxx" />
            <HelpItem icon={IconMail} label="Email Us" value="support@supplements.ge" />
            
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>FAQ</Text>
            {['How to track my order?', 'Return Policy', 'Shipping Information'].map((faq, i) => (
                <TouchableOpacity 
                    key={i} 
                    style={[styles.faqItem, { backgroundColor: colors.surface }, webStyles.pointer]}
                >
                    <Text style={[styles.faqText, { color: colors.text }]}>{faq}</Text>
                </TouchableOpacity>
            ))}
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
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
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
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    faqItem: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    faqText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
