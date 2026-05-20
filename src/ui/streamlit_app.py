import requests
import streamlit as st


API_URL = "http://127.0.0.1:8000/analyze"

st.set_page_config(page_title="Clinical Conversation Analyzer", layout="wide")

st.title("Clinical Conversation Analyzer")

uploaded_file = st.file_uploader("Upload consultation audio", type=["wav", "mp3"])

if uploaded_file:
    st.audio(uploaded_file)

    if st.button("Analyze"):
        with st.spinner("Processing audio..."):
            files = {
                "file": (
                    uploaded_file.name,
                    uploaded_file.getvalue(),
                    uploaded_file.type,
                )
            }

            response = requests.post(API_URL, files=files)

        # Handle response
        if response.status_code == 200:
            report = response.json()

            st.success("Analysis completed.")

            # Summary
            st.subheader("Clinical Summary")
            st.write(report["summary"])

            # SOAP
            soap = report["soap"]

            col1, col2 = st.columns(2)

            with col1:
                st.subheader("Subjective")

                for item in soap["subjective"]:
                    st.write(f"- {item}")

                st.subheader("Objective")

                for item in soap["objective"]:
                    st.write(f"- {item}")

            with col2:
                st.subheader("Assessment")

                for item in soap["assessment"]:
                    st.write(f"- {item}")

                st.subheader("Plan")

                for item in soap["plan"]:
                    st.write(f"- {item}")

            # Entities
            st.subheader("Clinical Entities")

            entities = report["entities"]

            col3,col4 = st.columns(2)
            with col3:
                st.subheader("Symptoms")

                for item in entities["symptoms"]:
                    st.write(f"- {item}")

                st.subheader("Medications")

                for item in entities["medications"]:
                    st.write(f"- {item}")

            with col4:
                st.subheader("Diagnosis")

                for item in entities["diagnosis"]:
                    st.write(f"- {item}")

                st.subheader("Duration")

                for item in entities["duration"]:
                    st.write(f"- {item}")

        else:
            st.error("API request failed.")
            st.write(response.text)
