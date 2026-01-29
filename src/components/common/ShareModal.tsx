import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Clipboard,
  Platform,
} from 'react-native';
import { useApp } from '../../context';
import { BottomSheetModal } from './BottomSheetModal';
import Svg, { Path } from 'react-native-svg';

// Icons
const IconLink = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);

const IconShareNative = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <Path d="m16 6-4-4-4 4" />
    <Path d="M12 2v13" />
  </Svg>
);

const IconCheck = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const IconFacebook = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
    <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </Svg>
);

const IconTwitter = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2">
    <Path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </Svg>
);

const IconWhatsApp = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#25D366">
    <Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </Svg>
);

const IconTelegram = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#0088cc">
    <Path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </Svg>
);


const IconClose = ({ size = 24, color = '#18181B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export interface ShareItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'product' | 'order' | 'program';
  url?: string;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  item: ShareItem;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  item,
}) => {
  const { colors, isDark } = useApp();
  const [copied, setCopied] = useState(false);

  const shareUrl = item.url || `https://supplements.ge/${item.type}/${item.id}`;
  const shareMessage = `${item.title}\n${item.description}\n${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await Clipboard.setString(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        url: shareUrl,
        title: item.title,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSocialShare = (platform: string) => {
    let finalUrl = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(item.title);

    switch (platform) {
      case 'facebook':
        finalUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        finalUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        finalUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        finalUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
    }
    handleNativeShare();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <BottomSheetModal containerStyle={{ paddingVertical: Platform.OS === 'web' ? 24 : 0 }} onClose={onClose} height={Platform.OS === 'web' ? 'auto' : '50%'}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Share
          </Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: colors.gray100 }]}
            onPress={onClose}
          >
            <IconClose size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Main Share Options */}
          <View style={styles.mainOptions}>
            <TouchableOpacity
              style={[
                  styles.mainOption, 
                  { 
                      backgroundColor: colors.surface, 
                      borderColor: colors.gray100,
                      shadowColor: isDark ? '#000' : '#888',
                      shadowOpacity: isDark ? 0.3 : 0.08,
                  }
              ]}
              onPress={handleCopyLink}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: copied ? colors.success + '20' : colors.accentLight }]}>
                {copied ? (
                  <IconCheck size={24} color={colors.success} />
                ) : (
                  <IconLink size={24} color={colors.accent} />
                )}
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                {copied ? 'Copied!' : 'Copy Link'}
              </Text>
              <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
                Copy link to clipboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                  styles.mainOption, 
                  { 
                      backgroundColor: colors.surface, 
                      borderColor: colors.gray100,
                      shadowColor: isDark ? '#000' : '#888',
                      shadowOpacity: isDark ? 0.3 : 0.08,
                  }
              ]}
              onPress={handleNativeShare}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.accentLight }]}>
                <IconShareNative size={24} color={colors.accent} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.text }]}>
                Share Via
              </Text>
              <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
                Share using other apps
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Share Options */}
          <View style={styles.socialSection}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              Share on
            </Text>
            <View style={styles.socialGrid}>
              <TouchableOpacity
                style={[
                    styles.socialButton, 
                    { 
                        backgroundColor: colors.surface, 
                        borderColor: colors.gray100,
                        shadowColor: isDark ? '#000' : '#888',
                        shadowOpacity: isDark ? 0.3 : 0.08,
                    }
                ]}
                onPress={() => handleSocialShare('facebook')}
              >
                <IconFacebook size={32} />
                <Text style={[styles.socialLabel, { color: colors.text }]}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                    styles.socialButton, 
                    { 
                        backgroundColor: colors.surface, 
                        borderColor: colors.gray100,
                        shadowColor: isDark ? '#000' : '#888',
                        shadowOpacity: isDark ? 0.3 : 0.08,
                    }
                ]}
                onPress={() => handleSocialShare('twitter')}
              >
                <IconTwitter size={32} />
                <Text style={[styles.socialLabel, { color: colors.text }]}>Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                    styles.socialButton, 
                    { 
                        backgroundColor: colors.surface, 
                        borderColor: colors.gray100,
                        shadowColor: isDark ? '#000' : '#888',
                        shadowOpacity: isDark ? 0.3 : 0.08,
                    }
                ]}
                onPress={() => handleSocialShare('whatsapp')}
              >
                <IconWhatsApp size={32} />
                <Text style={[styles.socialLabel, { color: colors.text }]}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                    styles.socialButton, 
                    { 
                        backgroundColor: colors.surface, 
                        borderColor: colors.gray100,
                        shadowColor: isDark ? '#000' : '#888',
                        shadowOpacity: isDark ? 0.3 : 0.08,
                    }
                ]}
                onPress={() => handleSocialShare('telegram')}
              >
                <IconTelegram size={32} />
                <Text style={[styles.socialLabel, { color: colors.text }]}>Telegram</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mainOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mainOption: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    ...Platform.select({
       web: { 
         boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
       } as any 
    })
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  socialSection: {
    // marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    ...Platform.select({
       web: { 
         boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
       } as any 
    })
  },
  socialLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});
