precision mediump float;

varying vec3 vColor;

uniform bool uEnableLighting;
uniform bool uEnableTexture;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

uniform sampler2D uSampler;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
// the texCoords passed in from the vertex shader.
varying vec2 vTextureCoord;

const float ambientFactor = 0.2;
const float shininess = 1.0;
const vec3 specularMaterialColor = vec3(0.1, 0.1, 0.1);

void main() {
    vec3 baseColor = vColor;

    if (uEnableTexture) {
            baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;

    }

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