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

RUN pwd && pwd && pwd && pwd && ls && pwd && pwd && ls
RUN mkdir -p /home/coder/bolty-worker
RUN wget --no-cache https://github.com/Spirit-Hacker/remote-vscode-extension/raw/refs/heads/main/site-genie-listener-0.0.1.vsix
RUN code-server --install-extension site-genie-listener-0.0.1.vsix

CMD [ "code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080", "/home/coder/bolty-worker" ]
