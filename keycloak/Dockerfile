FROM quay.io/keycloak/keycloak:latest
COPY entrypoint.sh /opt/keycloak/bin/keycloak-entrypoint.sh
USER root
RUN sed -i 's/\r//' /opt/keycloak/bin/keycloak-entrypoint.sh \
    && chmod +x /opt/keycloak/bin/keycloak-entrypoint.sh
USER keycloak
ENTRYPOINT ["/opt/keycloak/bin/keycloak-entrypoint.sh"]
