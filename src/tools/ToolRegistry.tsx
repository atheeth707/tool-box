import AIFaceSwap from './AIFaceSwap'
import AISpeechGenerator from './AISpeechGenerator'
import Textbooks2 from './Textbooks2'
import Textbooks1 from './Textbooks1'
import Textbooks from './Textbooks'
import MediaClips from './MediaClips'
import AudioDownload from './AudioDownload'
import AIChatbot from './AIChatbot'
import UserReport from './UserReport'
import AIImageGenerator from './AIImageGenerator'
import InstagramCaptionGenerator from './InstagramCaptionGenerator'
import AIContentTools from './AIContentTools'
import AIVideoTools from './AIVideoTools';
import AIWebsiteTools from './AIWebsiteTools';
import AIImageTools from './AIImageTools';
import ReactionTest from './ReactionTest';
import TypingTest from './TypingTest';
import CPSCounter from './CPSCounter';
import MemoryMatch from './MemoryMatch';
import NumberGuess from './NumberGuess';
import RockPaperScissors from './RockPaperScissors';
import Quiz from './Quiz';
import SpinWheel from './SpinWheel';
import Challenges from './Challenges';
import TruthDare from './TruthDare';
import BrowserInfo from './BrowserInfo';
import SpeedTest from './SpeedTest';
import PingTool from './PingTool';
import Base64FileDecoder from './Base64FileDecoder';
import AIBackgroundRemover from './AIBackgroundRemover';
import PasswordGenerator from './PasswordGenerator';
import WordCounter from './WordCounter';
import Base64Encoder from './Base64Encoder';
import AgeCalculator from './AgeCalculator';
import WhatsAppLink from './WhatsAppLink';
import UnitConverter from './UnitConverter';
import QrGenerator from './QrGenerator';
import ImageResizer from './ImageResizer';
import TextCaseConverter from './TextCaseConverter';
import RemoveDuplicateLines from './RemoveDuplicateLines';
import SlugGenerator from './SlugGenerator';
import JsonFormatter from './JsonFormatter';
import PercentageCalculator from './PercentageCalculator';
import PasswordStrength from './PasswordStrength';
import UuidGenerator from './UuidGenerator';
import RandomColor from './RandomColor';
import UrlEncoder from './UrlEncoder';
import TextReverser from './TextReverser';
import TextSorter from './TextSorter';
import LoremIpsumGenerator from './LoremIpsumGenerator';
import HtmlEncoder from './HtmlEncoder';
import BasicCalculator from './BasicCalculator';
import DiscountCalculator from './DiscountCalculator';
import BmiCalculator from './BmiCalculator';
import DaysBetweenDates from './DaysBetweenDates';
import DiceRoller from './DiceRoller';
import YesNoGenerator from './YesNoGenerator';
import GstCalculator from './GstCalculator';
import EmiCalculator from './EmiCalculator';
import LoanCalculator from './LoanCalculator';
import ScientificCalculator from './ScientificCalculator';
import CountdownTimer from './CountdownTimer';
import Stopwatch from './Stopwatch';
import TimeZoneConverter from './TimeZoneConverter';
import WorkingDaysCalculator from './WorkingDaysCalculator';
import TimeDurationCalculator from './TimeDurationCalculator';
import EpochToDate from './EpochToDate';
import DateToEpoch from './DateToEpoch';
import RandomDateGenerator from './RandomDateGenerator';
import PomodoroTimer from './PomodoroTimer';
import ImageCompressor from './ImageCompressor';
import ImageCropper from './ImageCropper';
import PngToJpg from './PngToJpg';
import JpgToPng from './JpgToPng';
import ImageToBase64 from './ImageToBase64';
import Base64ToImage from './Base64ToImage';
import ImageRotator from './ImageRotator';
import ImageFlipper from './ImageFlipper';
import ColorPicker from './ColorPicker';
import UtmBuilder from './UtmBuilder';
import MetaTagGenerator from './MetaTagGenerator';
import OpenGraphPreview from './OpenGraphPreview';
import KeywordDensity from './KeywordDensity';
import RobotsTxtGenerator from './RobotsTxtGenerator';
import SitemapBuilder from './SitemapBuilder';
import EmailExtractor from './EmailExtractor';
import IpChecker from './IpChecker';
import UserAgentParser from './UserAgentParser';
import Md5Generator from './Md5Generator';
import Sha256Generator from './Sha256Generator';
import RandomStringGenerator from './RandomStringGenerator';
import Base64FileEncoder from './Base64FileEncoder';
import TokenGenerator from './TokenGenerator';
import EncryptionDemo from './EncryptionDemo';
import MemeGenerator from './MemeGenerator';
import AsciiArtGenerator from './AsciiArtGenerator';
import NicknameGenerator from './NicknameGenerator';
import RandomNumberGenerator from './RandomNumberGenerator';
import CoinFlip from './CoinFlip';
import RandomNamePicker from './RandomNamePicker';
import WheelSpinner from './WheelSpinner';
import YtThumbnailDownloader from './YtThumbnailDownloader';
import VideoMetadata from './VideoMetadata';
import VideoEmbed from './VideoEmbed';
import AudioExtractor from './AudioExtractor';
import VideoToGif from './VideoToGif';
import LinkPreview from './LinkPreview';
import UrlShortenerMock from './UrlShortenerMock';
import LinkQrCode from './LinkQrCode';
import SocialShareGenerator from './SocialShareGenerator';
import FileMetadata from './FileMetadata';
import P2PRoom from './P2PRoom';
import RegexTester from './RegexTester';
import DiffChecker from './DiffChecker';
import CodeBeautifier from './CodeBeautifier';
import CodeMinifier from './CodeMinifier';
import JwtDecoder from './JwtDecoder';
import CronGenerator from './CronGenerator';
import SqlFormatter from './SqlFormatter';
import ColorConverter from './ColorConverter';
import MarkdownPreviewer from './MarkdownPreviewer';
import HttpHeaderParser from './HttpHeaderParser';
import CsvToJson from './CsvToJson';
import JsonToCsv from './JsonToCsv';
import XmlToJson from './XmlToJson';
import JsonToXml from './JsonToXml';
import TableGenerator from './TableGenerator';
import DataSorter from './DataSorter';
import DuplicateRowRemover from './DuplicateRowRemover';
import NumberFormatter from './NumberFormatter';
import FileSizeConverter from './FileSizeConverter';
import TextTableGenerator from './TextTableGenerator';
import InvoiceGenerator from './InvoiceGenerator';
import ResumeBuilder from './ResumeBuilder';
import NotesApp from './NotesApp';
import TodoList from './TodoList';
import HabitTracker from './HabitTracker';
import MeetingTimer from './MeetingTimer';
import DailyPlanner from './DailyPlanner';
import TextNotepad from './TextNotepad';
import ClipboardManager from './ClipboardManager';
import GoalTracker from './GoalTracker';
import YtTitleGenerator from './YtTitleGenerator';
import HashtagGenerator from './HashtagGenerator';
import RandomStoryGenerator from './RandomStoryGenerator';
import FakeChatGenerator from './FakeChatGenerator';
import ThumbnailPreview from './ThumbnailPreview';
import CaptionFormatter from './CaptionFormatter';
import FontStyleGenerator from './FontStyleGenerator';
import TextGlitch from './TextGlitch';
import EmojiCombiner from './EmojiCombiner';
import AsciiBanner from './AsciiBanner';
import ComingSoon from './ComingSoon';
import ImageToPdf from './ImageToPdf';
export const ToolComponents: Record<string, React.FC> = {
  'password-generator': PasswordGenerator,
  'word-counter': WordCounter,
  'base64-encoder': Base64Encoder,
  'age-calculator': AgeCalculator,
  'whatsapp-link': WhatsAppLink,
  'unit-converter': UnitConverter,
  'qr-generator': QrGenerator,
  'image-resizer': ImageResizer,
  'text-case-converter': TextCaseConverter,
  'remove-duplicate-lines': RemoveDuplicateLines,
  'slug-generator': SlugGenerator,
  'json-formatter': JsonFormatter,
  'percentage-calculator': PercentageCalculator,
  'password-strength': PasswordStrength,
  'uuid-generator': UuidGenerator,
  'random-color': RandomColor,
  'url-encoder': UrlEncoder,
  'text-reverser': TextReverser,
  'text-sorter': TextSorter,
  'lorem-ipsum-generator': LoremIpsumGenerator,
  'html-encoder': HtmlEncoder,
  'basic-calculator': BasicCalculator,
  'discount-calculator': DiscountCalculator,
  'bmi-calculator': BmiCalculator,
  'days-between-dates': DaysBetweenDates,
  'dice-roller': DiceRoller,
  'yes-no-generator': YesNoGenerator,
  'gst-calculator': GstCalculator,
  'emi-calculator': EmiCalculator,
  'loan-calculator': LoanCalculator,
  'scientific-calculator': ScientificCalculator,
  'countdown-timer': CountdownTimer,
  'stopwatch': Stopwatch,
  'timezone-converter': TimeZoneConverter,
  'working-days-calculator': WorkingDaysCalculator,
  'time-duration-calculator': TimeDurationCalculator,
  'epoch-to-date': EpochToDate,
  'date-to-epoch': DateToEpoch,
  'random-date-generator': RandomDateGenerator,
  'pomodoro-timer': PomodoroTimer,
  'image-compressor': ImageCompressor,
  'image-cropper': ImageCropper,
  'png-to-jpg': PngToJpg,
  'jpg-to-png': JpgToPng,
  'image-to-base64': ImageToBase64,
  'base64-to-image': Base64ToImage,
  'image-rotator': ImageRotator,
  'image-flipper': ImageFlipper,
  'color-picker': ColorPicker,
  'utm-builder': UtmBuilder,
  'meta-tag-generator': MetaTagGenerator,
  'open-graph-preview': OpenGraphPreview,
  'keyword-density-checker': KeywordDensity,
  'robots-txt-generator': RobotsTxtGenerator,
  'sitemap-builder': SitemapBuilder,
  'email-extractor': EmailExtractor,
  'ip-checker': IpChecker,
  'user-agent-parser': UserAgentParser,
  'md5-generator': Md5Generator,
  'sha256-generator': Sha256Generator,
  'random-string-generator': RandomStringGenerator,
  'base64-file-encoder': Base64FileEncoder,
  'token-generator': TokenGenerator,
  'encryption-demo': EncryptionDemo,
  'meme-generator': MemeGenerator,
  'ascii-art-generator': AsciiArtGenerator,
  'nickname-generator': NicknameGenerator,
  'random-number-generator': RandomNumberGenerator,
  'coin-flip': CoinFlip,
  'random-name-picker': RandomNamePicker,
  'wheel-spinner': WheelSpinner,
  'yt-thumbnail-downloader': YtThumbnailDownloader,
  'video-metadata': VideoMetadata,
  'video-embed': VideoEmbed,
  'audio-extractor': AudioExtractor,
  'video-to-gif': VideoToGif,
  'link-preview': LinkPreview,
  'url-shortener-mock': UrlShortenerMock,
  'link-qr-code': LinkQrCode,
  'social-share-generator': SocialShareGenerator,
  'file-metadata': FileMetadata,
  'p2p-file-sharing': () => <P2PRoom defaultTab="files" />,
  'p2p-text-chat': () => <P2PRoom defaultTab="chat" />,
  'secure-room-join': () => <P2PRoom defaultTab="connect" />,
  'clipboard-sharing': () => <P2PRoom defaultTab="chat" />,
  'image-sharing-p2p': () => <P2PRoom defaultTab="files" />,
  'connection-status-ui': () => <P2PRoom defaultTab="connect" />,
  'qr-code-join-room': () => <P2PRoom defaultTab="connect" />,
  'drag-drop-file-send': () => <P2PRoom defaultTab="files" />,
  'multi-user-room': () => <P2PRoom defaultTab="connect" />,
  'encryption-layer': () => <P2PRoom defaultTab="security" />,
  'regex-tester': RegexTester,
  'diff-checker': DiffChecker,
  'code-beautifier': CodeBeautifier,
  'code-minifier': CodeMinifier,
  'jwt-decoder': JwtDecoder,
  'cron-generator': CronGenerator,
  'sql-formatter': SqlFormatter,
  'color-converter': ColorConverter,
  'markdown-previewer': MarkdownPreviewer,
  'http-header-parser': HttpHeaderParser,
  'csv-to-json': CsvToJson,
  'json-to-csv': JsonToCsv,
  'xml-to-json': XmlToJson,
  'json-to-xml': JsonToXml,
  'table-generator': TableGenerator,
  'data-sorter': DataSorter,
  'duplicate-row-remover': DuplicateRowRemover,
  'number-formatter': NumberFormatter,
  'file-size-converter': FileSizeConverter,
  'text-table-generator': TextTableGenerator,
'base64-file-decoder': Base64FileDecoder,
'ai-background-remover': AIBackgroundRemover,
  // ✅ ADDED — these were imported but missing from the map
  'invoice-generator': InvoiceGenerator,
  'resume-builder': ResumeBuilder,
  'notes-app': NotesApp,
  'todo-list': TodoList,
  'habit-tracker': HabitTracker,
  'meeting-timer': MeetingTimer,
  'daily-planner': DailyPlanner,
  'text-notepad': TextNotepad,
  'clipboard-manager': ClipboardManager,
  'goal-tracker': GoalTracker,
  'yt-title-generator': YtTitleGenerator,
  'hashtag-generator': HashtagGenerator,
  'random-story-generator': RandomStoryGenerator,
  'fake-chat-generator': FakeChatGenerator,
  'thumbnail-preview': ThumbnailPreview,
  'caption-formatter': CaptionFormatter,
  'font-style-generator': FontStyleGenerator,
  'text-glitch': TextGlitch,
  'emoji-combiner': EmojiCombiner,
  'ascii-banner': AsciiBanner,
'image-to-pdf': ImageToPdf,
'reaction-test': ReactionTest,
'typing-test': TypingTest,
'cps-counter': CPSCounter,
'memory-match': MemoryMatch,
'number-guess': NumberGuess,
'rock-paper-scissors': RockPaperScissors,
'quiz': Quiz,
'spin-wheel': SpinWheel,
'challenges': Challenges,
'truth-dare': TruthDare,
'browser-info': BrowserInfo,
'speed-test': SpeedTest,
'ping-tool': PingTool,
'ai-image-tools': AIImageTools,
'ai-video-tools': AIVideoTools,
'ai-website-tools': AIWebsiteTools,
'ai-content-tools': AIContentTools,
'instagram-caption-generator':InstagramCaptionGenerator,
'ai-image-generator': AIImageGenerator,
'ai-chatbot': AIChatbot,
'report': UserReport,
'audio-downloader': AudioDownload,
'clips-downloder': MediaClips,
'12thbooks': Textbooks,
'11thbooks': Textbooks1,
'10thbooks': Textbooks2,
'ai-speech-generator': AISpeechGenerator,
'ai-faceswap': AIFaceSwap,
};

export const getToolComponent = (id: string) => {
  return ToolComponents[id] || ComingSoon;
};