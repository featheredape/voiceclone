from flask import Flask, render_template, request, send_from_directory
import os
import subprocess
import requests

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'audio_data' not in request.files:
        return 'No audio file part', 400
    file = request.files['audio_data']
    if file.filename == '':
        return 'No selected file', 400
    webm_path = os.path.join(UPLOAD_FOLDER, 'outaudio.webm')
    file.save(webm_path)

    # Convert WebM to MP4 using ffmpeg
    mp4_path = os.path.join(UPLOAD_FOLDER, 'outaudio.mp4')
    convert_to_mp4(webm_path, mp4_path)

    return 'File successfully saved', 200

def convert_to_mp4(webm_path, mp4_path):
    try:
        subprocess.run([
            'ffmpeg', '-i', webm_path, '-c:v', 'libx264', '-c:a', 'aac', '-strict', 'experimental', mp4_path
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error converting file: {e}")

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/tts')
def proxy_tts():
    res = requests.request(  # ref. https://stackoverflow.com/a/36601467/248616
        method          = request.method,
        url             = 'http://0.0.0.0:58003/tts',
        headers         = {k:v for k,v in request.headers if k.lower() != 'host'}, # exclude 'host' header
        data            = request.get_data(),
        # cookies         = request.cookies,
        # allow_redirects = False,
    )

    #region exlcude some keys in :res response
    # excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']  #NOTE we here exclude all "hop-by-hop headers" defined by RFC 2616 section 13.5.1 ref. https://www.rfc-editor.org/rfc/rfc2616#section-13.5.1
    # headers          = [
    #     (k,v) for k,v in res.raw.headers.items()
    #     if k.lower() not in excluded_headers
    # ]
    #endregion exlcude some keys in :res response

    response = Response(res.content, res.status_code, headers)
    return response

if __name__ == '__main__':
    app.run('0.0.0.0')
