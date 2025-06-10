FROM codercom/code-server:4.96.4

USER root
RUN apt-get update \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER coder

EXPOSE 8080

RUN mkdir -p /home/coder/.local/share/code-server/User/
COPY settings.json /home/coder/.local/share/code-server/User/settings.json
RUN sudo chown -R coder:coder /home/coder/.local/share/code-server/User/settings.json

RUN mkdir -p /home/coder/bolty-worker
RUN wget --no-cache https://github.com/Spirit-Hacker/remote-vscode-extension/raw/refs/heads/main/site-genie-listener-0.0.1.vsix
RUN code-server --install-extension site-genie-listener-0.0.1.vsix

CMD [ "code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080", "/home/coder/bolty-worker" ]
