// filepath: src/components/AssessmentHeader.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/typography';

// ── Step definitions (shared across all assessment screens) ───────────────────
export const ASSESSMENT_STEPS = [
  { id: 'test', label: 'Pagsubok', iconName: 'pencil' },
  { id: 'demographic', label: 'Propilo', iconName: 'user' },
  { id: 'camera', label: 'Larawan', iconName: 'camera' },
  { id: 'result', label: 'Resulta', iconName: 'star' },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface AssessmentHeaderProps {
  /** 0-based index of the current step */
  currentStep: number;
  /** Screen title shown in the centre (e.g. "PAGSUBOK") */
  title: string;
  /** Smaller Baybayin label above the title */
  baybayinLabel?: string;
  /** Sub-line below the title */
  subtitle?: string;
  /** Called when the back arrow is pressed */
  onBack: () => void;
  /** Right-side action button label (optional) */
  actionLabel?: string;
  /** Whether the right-side action is enabled */
  actionEnabled?: boolean;
  /** Called when the right action is pressed */
  onAction?: () => void;
  /** Right-side action icon name (FontAwesome) */
  actionIconName?: string;
}

// ── Animated progress width helper ───────────────────────────────────────────
function useProgressAnim(pct: number) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [pct]);
  return anim;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AssessmentHeader({
  currentStep,
  title,
  baybayinLabel = 'ᜉᜋᜈ',
  subtitle,
  onBack,
  actionLabel,
  actionEnabled = false,
  onAction,
  actionIconName = 'send',
}: AssessmentHeaderProps) {
  const totalSteps = ASSESSMENT_STEPS.length;
  // Progress: arriving at step N means (N / totalSteps) of the journey is done.
  // step 0 → 25 %, step 1 → 50 %, step 2 → 75 %, step 3 → 100 %
  const progressPct = ((currentStep + 1) / totalSteps) * 100;
  const progressAnim = useProgressAnim(progressPct);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      {/* ── Title row ── */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerFade, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <TouchableOpacity style={styles.backCircle} onPress={onBack}>
          <Icon name="arrow-left" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerBaybayin}>{baybayinLabel}</Text>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
        </View>

        {actionLabel ? (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              !actionEnabled && styles.actionBtnDisabled,
            ]}
            onPress={onAction}
            disabled={!actionEnabled}
          >
            <Icon
              name={actionIconName}
              size={13}
              color={actionEnabled ? COLORS.textContrast : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.actionText,
                !actionEnabled && styles.actionTextDisabled,
              ]}
            >
              {' '}
              {actionLabel}
            </Text>
          </TouchableOpacity>
        ) : (
          // Invisible spacer so title stays centred
          <View style={styles.actionPlaceholder} />
        )}
      </Animated.View>

      {/* ── Baybayin strip ── */}
      <View style={styles.baybayinStrip}>
        <Text style={styles.baybayinStripText}>
          ᜊᜌᜊᜈᜒ · ᜉᜋᜈ · ᜃᜐᜌᜐᜌᜈ · ᜉᜒᜎᜒᜉᜒᜈᜎ ·
        </Text>
      </View>

      {/* ── Step indicators ── */}
      <View style={styles.stepsContainer}>
        {ASSESSMENT_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === totalSteps - 1;
          return (
            <React.Fragment key={step.id}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isActive && styles.stepCircleActive,
                    isCompleted && styles.stepCircleCompleted,
                  ]}
                >
                  <Icon
                    name={isCompleted ? 'check' : step.iconName}
                    size={13}
                    color={
                      isActive || isCompleted
                        ? COLORS.textContrast
                        : COLORS.textSecondary
                    }
                  />
                </View>
                <Text
                  style={[styles.stepLabel, isActive && styles.stepLabelActive]}
                >
                  {step.label}
                </Text>
              </View>

              {!isLast && (
                <View style={styles.stepConnectorWrap}>
                  <View style={styles.stepConnectorBg} />
                  {isCompleted && <View style={styles.stepConnectorFill} />}
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* ── Progress bar ── */}

      {/* ── Ornate divider ── */}
      <View style={styles.ornamentDivider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerStar}>✦</Text>
        <View style={styles.dividerLine} />
      </View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Header row ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.background,
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerBaybayin: {
    fontFamily: FONTS.baybayin,
    fontSize: 10,
    color: COLORS.primaryLight,
    letterSpacing: 3,
    marginBottom: -2,
  },
  headerTitle: {
    fontFamily: FONTS.kawitBold,
    fontSize: 18,
    letterSpacing: 5,
    color: COLORS.primary,
  },
  headerSub: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 9,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  actionBtnDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.secondary,
  },
  actionText: {
    color: COLORS.textContrast,
    fontFamily: FONTS.PoppinsBold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
  actionTextDisabled: {
    color: COLORS.textSecondary,
  },
  actionPlaceholder: {
    width: 42,
  },

  // ── Baybayin strip ──
  baybayinStrip: {
    backgroundColor: COLORS.primary,
    paddingVertical: 5,
  },
  baybayinStripText: {
    fontFamily: FONTS.baybayin,
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 4,
    textAlign: 'center',
  },

  // ── Steps ──
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  stepItem: { alignItems: 'center', gap: 5 },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryLight,
  },
  stepLabel: {
    fontFamily: FONTS.PoppinsRegular,
    fontSize: 8,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontFamily: FONTS.PoppinsBold,
  },
  stepConnectorWrap: {
    flex: 1,
    height: 1.5,
    marginHorizontal: 4,
    marginBottom: 18,
    position: 'relative',
  },
  stepConnectorBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary,
  },
  stepConnectorFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primaryLight,
  },

  // ── Progress ──
  progressContainer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: FONTS.PoppinsBold,
    fontSize: 10,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  progressCount: {
    fontFamily: FONTS.kawitBold,
    fontSize: 15,
    color: COLORS.primary,
  },
  progressTotal: {
    fontFamily: FONTS.PoppinsRegular,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  progressSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  tickRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tick: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
  },
  tickAnswered: {
    backgroundColor: COLORS.primaryLight,
  },

  // ── Ornament divider ──
  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.secondary,
  },
  dividerStar: {
    color: COLORS.primaryLight,
    fontSize: 10,
  },
});
