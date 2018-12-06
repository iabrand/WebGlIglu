precision mediump float;

varying vec3 vColor;

uniform bool uEnableLighting;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

uniform sampler2D uSampler;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

const float ambientFactor = 0.2;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.2, 0.2, 0.2);

void main() {
    vec3 baseColor = vColor;

    if (uEnableLighting) {
        gl_FragColor = vec4(baseColor, 1.0);
        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);

        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // diffuse lighting
        float diffuseFactor = max(dot(normal, lightDirectionEye), 0.0);
        vec3 diffuseColor = diffuseFactor * uLightColor * baseColor;

        // specular lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
           vec3 eyeDir = normalize(-vVertexPositionEye3);
           vec3 reflectionDir = reflect(-lightDirectionEye, normal);
           float cosPhi = max(dot(reflectionDir, eyeDir), 0.0);
           float specularFactor = pow(cosPhi, shininess);
           specularColor = specularFactor * uLightColor * specularMaterialColor;
        }

        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1.0);
    }
    else {
        gl_FragColor = vec4(baseColor, 1.0);
    }
}