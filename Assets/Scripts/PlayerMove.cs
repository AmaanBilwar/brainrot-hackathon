using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    [Header("Movement Settings")]
    private float baseMoveSpeedX; 
    public float moveSpeedXAtPointA = 5f; 
    public float moveSpeedXAtPointB = 1f;
    private float baseMoveSpeedY; 
    public float moveSpeedYAtPointA = 0.7f; 
    public float moveSpeedYAtPointB = 0.1f; 

    [Header("Scaling Settings")]
    public Transform shrinkTarget;
    public float scaleAtPointA = 1.5f; 
    public float scaleAtPointB = 0.1f; 

    [Header("Bobbing Settings")]
    public float baseBobbingSpeed = 5;
    private float baseBobbingAmount; 
    public float bobbingAmountAtPointA = 0.2f; 
    public float bobbingAmountAtPointB = 0.05f; 

    [Header("Y Follower Settings")]
    public Transform yFollower;
    public float yFollowerScaleAtPointA = 1.5f; 
    public float yFollowerScaleAtPointB = 0.1f; 
    public float yOffsetAtPointA = 0f; 
    public float yOffsetAtPointB = 2f; 

    [Header("References")]
    public Transform pointA; 
    public Transform pointB; 
    public SpriteRenderer spriteRenderer;

    private float minY;
    private float maxY;
    private Vector3 initialShrinkTargetPosition; 

    void Start()
    {
        minY = pointA.position.y;
        maxY = pointB.position.y;

        if (shrinkTarget == null)
        {
            shrinkTarget = this.transform;
        }

        initialShrinkTargetPosition = shrinkTarget.localPosition;
    }

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");

        float moveSpeedX = GetValueBasedOnY(transform.position.y, baseMoveSpeedX, moveSpeedXAtPointB, moveSpeedXAtPointA);
        float moveSpeedY = GetValueBasedOnY(transform.position.y, baseMoveSpeedY, moveSpeedYAtPointB, moveSpeedYAtPointA);

        Vector3 newPosition = transform.position;
        newPosition.x += horizontalInput * moveSpeedX * Time.deltaTime;
        newPosition.y += verticalInput * moveSpeedY * Time.deltaTime;

        newPosition.y = Mathf.Clamp(newPosition.y, minY, maxY);
        transform.position = newPosition;

        if (horizontalInput != 0 || verticalInput != 0)
        {
            ApplyBobbingBasedOnYPosition(transform.position.y);
        }

        AdjustScale(newPosition.y);

        if (yFollower != null)
        {
            UpdateYFollower(newPosition.y);
        }

        Flip(horizontalInput);
    }

    float GetValueBasedOnY(float currentY, float baseValue, float minValue, float maxValue)
    {
        float scale = Mathf.InverseLerp(maxY, minY, currentY);
        return Mathf.Lerp(minValue, maxValue, scale);
    }

    void ApplyBobbingBasedOnYPosition(float currentY)
    {
        float bobbingAmount = GetValueBasedOnY(currentY, baseBobbingAmount, bobbingAmountAtPointB, bobbingAmountAtPointA);
        float bobbingOffset = Mathf.Sin(Time.time * baseBobbingSpeed) * bobbingAmount; 
        Vector3 bobbingPosition = initialShrinkTargetPosition;
        bobbingPosition.y += bobbingOffset; 
        shrinkTarget.localPosition = bobbingPosition;
    }

    void AdjustScale(float currentY)
    {
        float newScale = GetValueBasedOnY(currentY, 1f, scaleAtPointB, scaleAtPointA);
        shrinkTarget.localScale = Vector3.one * newScale;
    }

    void UpdateYFollower(float currentY)
    {
        float yOffset = GetValueBasedOnY(currentY, 0f, yOffsetAtPointA, yOffsetAtPointB);

        Vector3 followerPosition = yFollower.position;
        followerPosition.y = currentY + yOffset;
        yFollower.position = followerPosition;

        float newScaleX = GetValueBasedOnY(currentY, 1f, yFollowerScaleAtPointB, yFollowerScaleAtPointA);
        Vector3 followerScale = yFollower.localScale;
/*        followerScale.x = newScaleX;
        yFollower.localScale = followerScale;*/
        yFollower.localScale = Vector3.one * newScaleX;

    }

    void Flip(float horizontalInput)
    {
        if (horizontalInput > 0)
        {
            spriteRenderer.flipX = true; 
        }
        else if (horizontalInput < 0)
        {
            spriteRenderer.flipX = false;
        }
    }
}
