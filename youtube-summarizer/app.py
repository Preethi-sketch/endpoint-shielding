import streamlit as st
import re
from youtube_transcript_api import YouTubeTranscriptApi
from google import genai

# Configure page layout
st.set_page_config(page_title="AI YouTube Summarizer", page_icon="🤖", layout="centered")

st.title("📺 AI YouTube Video Summarizer")
st.write("Paste a YouTube link below to generate a smart, structured summary instantly.")

# Input field for YouTube URL
youtube_url = st.text_input("YouTube Video URL", placeholder="https://www.youtube.com/watch?v=...")

# Function to extract Video ID from various YouTube URL formats
def extract_video_id(url):
    pattern = r'(?:v=|\/)([0-9A-Za-z_-]{11}).*'
    match = re.search(pattern, url)
    return match.group(1) if match else None

# Function to fetch transcript
def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        # Combine all text pieces into a single string
        full_text = " ".join([item['text'] for item in transcript_list])
        return full_text
    except Exception as e:
        return None

# Function to generate summary using Gemini
def summarize_text(transcript_text, api_key):
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert content summarizer. Please analyze the following YouTube video transcript and provide:
    1. **Overview**: A 3-sentence summary of what the video is about.
    2. **Key Takeaways**: Bullet points highlighting the main arguments, concepts, or tutorials shared.
    3. **Conclusion**: A brief wrap-up of the final message or outcome.

    Transcript:
    {transcript_text[:15000]}  # Truncate to stay within safe token limits for very long videos
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    return response.text

# Sidebar configuration for API Key
with st.sidebar:
    st.header("Configuration")
    api_key = st.text_input("Enter Gemini API Key", type="password")
    st.markdown("[Get a Gemini API Key](https://aistudio.google.com/)")

# Main action button
if st.button("Generate Summary"):
    if not api_key:
        st.error("Please enter your Gemini API key in the sidebar.")
    elif not youtube_url:
        st.warning("Please enter a valid YouTube URL.")
    else:
        video_id = extract_video_id(youtube_url)
        if not video_id:
            st.error("Invalid YouTube URL format. Could not extract Video ID.")
        else:
            with st.spinner("Fetching transcript and generating summary..."):
                transcript = get_transcript(video_id)
                
                if transcript is None:
                    st.error("Could not retrieve transcripts for this video. Captions might be disabled.")
                else:
                    summary = summarize_text(transcript, api_key)
                    st.success("Summary Generated Successfully!")
                    st.markdown("### Summary Results")
                    st.markdown(summary)